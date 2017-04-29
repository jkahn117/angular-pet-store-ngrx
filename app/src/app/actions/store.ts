//---- ACTIONS: store

import { Action } from '@ngrx/store';

import { Pet } from '../models/pet';

import { type } from '../util';


export const ActionTypes = {
  ADD_PET:              type('[Store] Add Pet'),
  ADD_PET_SUCCESS:      type('[Store] Add Pet Success'),
  ADD_PET_FAIL:         type('[Store] Add Pet Fail'),
  REMOVE_PET:           type('[Store] Remove Pet'),
  REMOVE_PET_SUCCESS:   type('[Store] Remove Pet Success'),
  REMOVE_PET_FAIL:      type('[Store] Remove Pet Fail'),
  LOAD:                 type('[Store] Load'),
  LOAD_SUCCESS:         type('[Store] Load Success'),
  LOAD_FAIL:            type('[Store] Load Fail'),
  SHOW_STORE:           type('[Store] Show Store')
};


/**
 * Add Pet to Store Actions
 */
export class AddPetAction implements Action {
  type = ActionTypes.ADD_PET;

  constructor(public payload: Pet) { }
}

export class AddPetSuccessAction implements Action {
  type = ActionTypes.ADD_PET_SUCCESS;

  constructor(public payload: Pet) { }
}

export class AddPetFailAction implements Action {
  type = ActionTypes.ADD_PET_FAIL;

  constructor(public payload: Pet) { }
}


/**
 * Remove Pet from Store Actions
 */
export class RemovePetAction implements Action {
  type = ActionTypes.REMOVE_PET;

  constructor(public payload: Pet) { }
}

export class RemovePetSuccessAction implements Action {
  type = ActionTypes.REMOVE_PET_SUCCESS;

  constructor(public payload: Pet) { }
}

export class RemovePetFailAction implements Action {
  type = ActionTypes.REMOVE_PET_FAIL;

  constructor(public payload: Pet) { }
}


/**
 * Load Store Actions
 */
export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor() { }
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload:Pet[]) { }
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: any) { }
}

export class ShowStoreAction implements Action {
  type = ActionTypes.SHOW_STORE;

  constructor() { }
}


export type Actions
  = AddPetAction
  | AddPetSuccessAction
  | AddPetFailAction
  | RemovePetAction
  | RemovePetSuccessAction
  | RemovePetFailAction
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction
  | ShowStoreAction;

 