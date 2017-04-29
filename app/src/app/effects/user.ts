import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';

import * as user from '../actions/user';
import * as storeActions from '../actions/store';
import * as fromRoot from '../reducers';
import { AuthService, AuthResult, AuthResultCode } from '../services/auth.service';


@Injectable()
export class UserEffects {

  constructor(
    private actions$:Actions,
    private store:Store<fromRoot.State>,
    private authService:AuthService
  ) { }

  @Effect()
  loginSuccess$: Observable<Action> = this.actions$
    .ofType(user.ActionTypes.LOGIN_SUCCESS, user.ActionTypes.NEW_PASSWORD_SUCCESS)
    .map( () => {
      return new storeActions.ShowStoreAction();
    });


  @Effect()
  login$: Observable<Action> = this.actions$
    // listen for the user#LOGIN action
    .ofType(user.ActionTypes.LOGIN)
    .map(toPayload)
    .switchMap( (payload) => {
      return this.authService.authenticate(payload.username, payload.password)
        .map( authResult => {
          switch(authResult.status) {
            case AuthResultCode.SUCCESS: {
              return new user.LoginSuccessAction(authResult.payload);
            }
            case AuthResultCode.FAILURE: {
              return new user.LoginFailAction(null);
            }
            case AuthResultCode.NEW_PASSWORD: {
              // next step requires use to track the returned user attribuets and the username
              let attributes = Object.assign({}, authResult.payload, { username: payload.username });
              return new user.NeedNewPasswordAction(attributes);
            }
          }
        })
        .catch( (error) => of(new user.LoginFailAction(error)) )
    });
    
  @Effect()
  logout$: Observable<Action> = this.actions$
    .ofType(user.ActionTypes.LOGOUT)
    .map( () => {
      this.authService.logout();
      return go([ '/login' ])
    });

  /**
    When NEED_NEW_PASSWORD action is received, navigate to the /newpassword
    route using router-store#go.
    */
  @Effect()
  navigateToNewPassword$: any = this.actions$
    .ofType(user.ActionTypes.NEED_NEW_PASSWORD)
    .map(() => go([ '/newpassword' ]));    // route to /newpassword


  /**
   When NEW_PASSWORD action is received, we attempt to change the user's password
   via the auth service and handle the result.

   NOTES:
     - in this case, the effect will use both the payload from the action as well
       as the current state from the Store
     - to enable above, added import for @ngrx Store
     - used rxjs#withLatestFrom to get the latest value of an Observable in the Store
       (user attributes)
     - pased both to switchMap
     - @see https://medium.com/@viestursv/how-to-get-store-state-in-ngrx-effect-fab9e9c8f087#.te9yl8zbg
     - @see https://github.com/ngrx/effects/issues/49 
   */
  @Effect()
  newPassword: Observable<Action> = this.actions$
    .ofType(user.ActionTypes.NEW_PASSWORD)
    .withLatestFrom( this.store.select(fromRoot.getCurrentUserAttributes) )
    .switchMap( ([action, attrs]) => {
      return this.authService.completePasswordChallenge(action.payload.username, attrs, action.payload.newPassword)
        .map( authResult => {
          switch(authResult.status) {
            case AuthResultCode.SUCCESS: {
              return new user.LoginSuccessAction(authResult.payload);
            }
            case AuthResultCode.FAILURE: {
              return new user.LoginFailAction(null);
            }
          }
        })
        .catch( (error) => of(new user.LoginFailAction(error)) );
    });
}

