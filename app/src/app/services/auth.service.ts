import { Injectable, Inject } from '@angular/core';

import * as AWS from 'aws-sdk';
import {
  AuthenticationDetails,
  CognitoIdentityServiceProvider,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUserSession,
  CognitoUser
} from 'amazon-cognito-identity-js';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import { CognitoHelper } from './cognito-helper';
import { AppConfig } from '../app.config';
import { User} from '../models/user';


/**

 AuthService

 */
export enum AuthResultCode {
  NONE,
  SUCCESS,
  FAILURE,
  NEW_PASSWORD
}

export interface AuthResult {
  status:  AuthResultCode,
  payload: any
}

let cognitoUser:CognitoUser = null;

@Injectable()
export class AuthService {

  constructor(private cognitoHelper:CognitoHelper) { }

  /**
   * 
   * TODO: Building a Promise and then converting to an Observable is cheating,
   * but could not figure out how to structure an Observable directly here...
   *
   * Named callbacks from authenticateUser...
   *
   */
  authenticate(username:string, password:string):Observable<AuthResult> {
    return Observable.fromPromise(this._authenticate(username, password));
  }

  private _authenticate(username:string, password:string):Promise<AuthResult> {
    console.log('AuthService: Login / Authenticate');

    // setting the stage... need to set the accessKeyId and secretAccessKey to something...
    AWS.config.update({
      region: AppConfig.cognitoUserPoolRegion,
      accessKeyId: 'initial',
      secretAccessKey: 'initial'
    });

    let authDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });

    cognitoUser = new CognitoUser({
      Username: username,
      Pool:     this.cognitoHelper.getUserPool()
    });

    let self = this;
    return new Promise( (resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: function(session:CognitoUserSession) {
          resolve( self._onSuccess(session) );
        },
        onFailure: function(error:any) {
          console.error('[ERROR] Authentication failed: ' + error.message);
          reject(error);
        },
        newPasswordRequired: function(userAttributes:any, requiredAttributes:any) {
          // TODO: in reality, should merge attributes and have user fill in any missing...
          var result = { status:  AuthResultCode.NEW_PASSWORD, payload: userAttributes };
          resolve(result);
        }
      });
    });
  }

  /**
   * Logs the current Cognito user out of the application.
   */
  logout() {
    console.log('AuthService: Logout');
    this.cognitoHelper.getCurrentUser().signOut();
  }

  /**
   * Returns true if there is an existing Cognito session, else false.
   * 
   * TODO: should we also refresh tokens here????
   */
  isLoggedIn():Observable<boolean> {
    return Observable.fromPromise(this._isLoggedIn());
  }

  private _isLoggedIn():Promise<boolean> {
    let cognitoUser = this.cognitoHelper.getCurrentUser();

    return new Promise( (resolve, reject) => {
      if (cognitoUser != null) {
        cognitoUser.getSession( (error, session) => {
          if (error) {
            console.error('[ERROR] AuthService: cannot get session: ' + error);
            reject(false);
          }
          else {
            resolve(session.isValid())
          }
        });
      }
      else {
        resolve(false);
      }
    });
  }

  /**
   *
   * Complete Password Challenge
   * 
   * When an admin creates a username and password for a user in a Cognito User Pool, the user
   * will need to change his password on first login. This is accomplished via the `completeNewPasswordChallenge`
   * method on `CognitoUser`.
   * 
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-identity-user-pools-javascript-example-authenticating-admin-created-user.html
   *
   */
  completePasswordChallenge(username:string, attributeData:any, newPassword:string):Observable<AuthResult> {
    return Observable.fromPromise(this._completePasswordChallenge(username, attributeData, newPassword));
  }

  private _completePasswordChallenge(username:string, attributeData:any, newPassword:string):Promise<AuthResult> {
    console.log('AuthService: Complete Password Challenge');

    // Cognito does not want email_verified or phone_number_verified to be updated
    // thus need to remove from the data in the `completeNewPasswordChallenge` method.
    // `attributeData` parameter is read-only as passed, thus make a copy to edit.    
    let data = Object.assign({}, attributeData);
    delete data.email_verified;
    delete data.phone_number_verified;
    delete data.username;  // extra one we included


    let self = this;
    return new Promise( (resolve, reject) => {
      // Need to be sure to work with the same CognitoUser created during authenticate step as
      // Cognito tracks the session.  Once authenticated, can use the CognitoUserPool to get the
      // currentUser but that seemingly does not work here. Tracking in a global variable -- not
      // great but workable for time being.
      cognitoUser.completeNewPasswordChallenge(newPassword, data, {
        onSuccess: function(session:CognitoUserSession) {
          resolve( self._onSuccess(session) );
        },
        onFailure: function(error:any) {
          console.error('[ERROR] Complete Password Challenge failed: ' + error.message);
          reject(error);
        }
      });
    }); 
  }

  /**
   * Refreshes the AWS credentials based on the login map. Retrieves the temporary
   * credentials for the currently logged in user, refreshing if needed.
   * 
   */
  refreshAWSCredentials():Promise<void> {
    var logins = {};

    var self = this;
    return new Promise<void> ( (resolve, reject) => {
      self.cognitoHelper.getCurrentUser().getSession( (error, session) => {
        if (error) {
          reject(error);
          return;
        }

        logins[`cognito-idp.${CognitoHelper.REGION}.amazonaws.com/${CognitoHelper.USER_POOL_ID}`] =
          session.getIdToken().getJwtToken();

        // Add the user's token to the credential map
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: CognitoHelper.IDENTITY_POOL_ID,
            Logins: logins
        });

        // TODO: add referesh required...
        // https://github.com/awslabs/aws-serverless-auth-reference-app/blob/4f93a602188a58fbe06387f2d86d538082251bb7/app/src/services/account-management.service.ts
        (AWS.config.credentials as AWS.Credentials).get( (err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });
      });
    });
  }

  /**
   * Success handler for authenticate and compeltePasswordChallenge methods.
   * Stores the current user in Cognito.
   * 
   * @param session 
   */
  private _onSuccess(session:CognitoUserSession):Promise<AuthResult> {
    return this.refreshAWSCredentials()
      .then( () => {
        return new Promise( (resolve, reject) => {
          // create new User object with tokens, reference to cognito session, etc?
          let user = {
            username:    cognitoUser.getUsername(),
            session:     session,
            credentials: AWS.config.credentials as AWS.Credentials
          };

          cognitoUser = null;
          //console.log("LoginService: set the AWS credentials - " + JSON.stringify(AWS.config.credentials));
          resolve( { status: AuthResultCode.SUCCESS, payload: user } );
        })
      });
  }
}
