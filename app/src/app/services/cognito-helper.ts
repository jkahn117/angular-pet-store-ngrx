import { Injectable, Inject }    from '@angular/core';

import * as AWS from 'aws-sdk';
import {
  AuthenticationDetails,
  CognitoIdentityServiceProvider,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from 'amazon-cognito-identity-js';

import { AppConfig } from '../app.config';

/**

 CognitoHelper

 */
@Injectable()
export class CognitoHelper {

  public static REGION           = AppConfig.cognitoUserPoolRegion;
  public static USER_POOL_ID     = AppConfig.cognitoUserPoolId;
  public static IDENTITY_POOL_ID = AppConfig.cognitoIdentityPoolId;
  public static APP_CLIENT_ID    = AppConfig.cognitoUserPoolAppClientId;

  public static POOL_DATA = {
    UserPoolId: CognitoHelper.USER_POOL_ID,
    ClientId:   CognitoHelper.APP_CLIENT_ID
  };

  getUserPool(): CognitoUserPool {
    return new CognitoUserPool(CognitoHelper.POOL_DATA);
  }

  getCurrentUser(): CognitoUser {
    return this.getUserPool().getCurrentUser();
  }

  getCognitoIdentityId(): string {
    return (AWS.config.credentials as AWS.CognitoIdentityCredentials).identityId;
  }
  
}