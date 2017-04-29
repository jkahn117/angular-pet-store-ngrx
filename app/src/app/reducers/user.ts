//---- REDUCER: user

import { createSelector } from 'reselect';

import { User } from    '../models/user';
import * as user from   '../actions/user';


export interface State {
  username: string;
  user: User;
  attributes:any;
};


export const initialState = {
  username: null,
  user: null,
  attributes: null
};

export function reducer(state = initialState, action: user.Actions): State {
  switch (action.type) {

    case user.ActionTypes.LOGIN_SUCCESS: {
      const newUser = action.payload;

      return {
        username: newUser.username,
        user: newUser,
        attributes: null
      }
    }

    case user.ActionTypes.LOGOUT:
    case user.ActionTypes.LOGIN_FAIL: {
      return Object.assign({}, initialState);
    }

    case user.ActionTypes.NEED_NEW_PASSWORD: {
      return {
        username: action.payload.username,
        user: null,
        attributes: action.payload
      }
    }

    default: {
      return state;
    }
  }
}

export const getCurrentUser = (state:State) => state.user;

export const getCurrentUserName = (state:State) => state.username;

export const getCurrentUserAttribuets = (state:State) => state.attributes;
