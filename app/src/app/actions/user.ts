//---- ACTIONS: user

import { Action } from '@ngrx/store';

import { User } from '../models/user';

import { type } from '../util';


export const ActionTypes = {
  LOGIN:                 type('[User] Login'),
  LOGIN_SUCCESS:         type('[User] Login Success'),
  LOGIN_FAIL:            type('[User] Login Fail'),
  LOGOUT:                type('[User] Logout'),
  NEED_NEW_PASSWORD:     type('[User] Need New Password'),
  NEW_PASSWORD:          type('[User] New Password'),
  NEW_PASSWORD_SUCCESS:  type('[User] New Password Success'),
  NEW_PASSWORD_FAIL:     type('[User] New Password Fail'),
};

/**
 * Login Actions
 */
export class LoginAction implements Action {
  type = ActionTypes.LOGIN;

  constructor(public payload:any) { }
}

export class LoginSuccessAction implements Action {
  type = ActionTypes.LOGIN_SUCCESS;

  constructor(public payload:any) { }
}

export class LoginFailAction implements Action {
  type = ActionTypes.LOGIN_FAIL;

  constructor(public payload:any) { }
}

export class LogoutAction implements Action {
  type = ActionTypes.LOGOUT;

  constructor() { }
}

/**
 * New Password Actions
 */
export class NeedNewPasswordAction implements Action {
  type = ActionTypes.NEED_NEW_PASSWORD;

  constructor(public payload:any) { }
}

export class NewPasswordAction implements Action {
  type = ActionTypes.NEW_PASSWORD;

  constructor(public payload:any) { }
}

export class NewPasswordSuccessAction implements Action {
  type = ActionTypes.NEW_PASSWORD_SUCCESS;

  constructor() { }
}

export class NewPasswordFailAction implements Action {
  type = ActionTypes.NEW_PASSWORD_FAIL;

  constructor(public payload:any) { }
}


export type Actions
  = LoginAction
  | LoginSuccessAction
  | LoginFailAction
  | LogoutAction
  | NeedNewPasswordAction
  | NewPasswordAction
  | NewPasswordSuccessAction
  | NewPasswordFailAction;


