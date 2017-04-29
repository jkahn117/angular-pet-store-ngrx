//---- REDUCER: pet

import * as store from '../actions/store';

export interface State {
  loaded: boolean;
  loading: boolean;
  ids: number[];
};

const initialState:State = {
  loaded: false,
  loading: false,
  ids: []
};


export function reducer(state = initialState, action: store.Actions): State {
  switch(action.type) {

    // store begins to load data
    case store.ActionTypes.LOAD: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    // store has loaded data successfully
    case store.ActionTypes.LOAD_SUCCESS: {
      const pets = action.payload;

      return {
        loaded: true,
        loading: false,
        ids: pets.map(pet => pet.id)
      };
    }

    // adding a pet to the store collection
    case store.ActionTypes.ADD_PET_SUCCESS:
    case store.ActionTypes.REMOVE_PET_FAIL: {
      const pet = action.payload;

      if (state.ids.indexOf(pet.id) > 1) {
        return state;
      }

      return Object.assign({}, state, {
        ids: [ ...state.ids, pet.id ]
      });
    }

    // remove a pet from the store collection
    case store.ActionTypes.REMOVE_PET_FAIL:
    case store.ActionTypes.ADD_PET_FAIL: {
      const pet = action.payload;

      return Object.assign({}, state, {
        ids: state.ids.filter(id => id !== pet.id)
      });
    }

    default: {
      return state;
    }
  }
};


export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getIds = (state: State) => state.ids;



