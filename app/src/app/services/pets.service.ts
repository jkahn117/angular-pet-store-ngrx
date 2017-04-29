import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import * as AWS from 'aws-sdk';
import * as AwsSignWeb from 'aws-sign-web';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../app.config';
import { CognitoHelper } from './cognito-helper';
import { Pet } from '../models/Pet';

@Injectable()
export class PetsService {

  constructor(
    private http:Http,
    private cognitoHelper:CognitoHelper
  ) { }

  private API_PATH:string = AppConfig.petApiEndpoint;


// TODO: move signing logic to subclass of Http:
// https://stackoverflow.com/questions/35498456/what-is-httpinterceptor-equivalent-in-angular2

  getPets(): Observable<Pet[]> {
    let path = `${AppConfig.petApiBasePath}`;

    var request = {
      method: 'GET',
      url:    `https://${AppConfig.petApiHost}${path}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      //params: {},
      //data: null
    };

    var signedRequest = this._awsSigner().sign(request);
    return this.http.get(`https://${AppConfig.petApiHost}${path}`, { headers: signedRequest })
      .map( res => res.json().data || [] );

    /* FOR REFERNCE: without signing...
    return this.http.get(this.API_PATH)
      .map(res => res.json().data || []);
      */
  }

  getPet(petId: string): Observable<Pet> {
    return this.http.get(`${this.API_PATH}/${petId}`)
      .map(res => res.json());

  }

  private _awsSigner():AwsSignWeb.AwsSigner {
    let options = {
      service:          'execute-api',
      region:           AppConfig.petApiRegion,
      accessKeyId:      AWS.config.credentials.accessKeyId,
      secretAccessKey:  AWS.config.credentials.secretAccessKey,
      sessionToken:     AWS.config.credentials.sessionToken
    }

    return new AwsSignWeb.AwsSigner(options);
  }
}
