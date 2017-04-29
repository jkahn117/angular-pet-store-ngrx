//---- REDUCER: pet

import { createSelector } from 'reselect';

import { Pet } from    '../models/pet';
import * as pet from   '../actions/pet';
import * as store from '../actions/store';


export interface State {
  ids: number[];
  entities: { [id:number]: Pet };
  selectedPetId: number | null;
};


export const initialState = {
  ids: [],
  entities: {},
  selectedPetId: null
};


export function reducer(state = initialState, action: pet.Actions | store.Actions): State {
  switch (action.type) {

    // store loaded successfullly (GET /pets)
    case store.ActionTypes.LOAD_SUCCESS: {
      const pets = action.payload;
      const newPets = pets.filter( pet => !state.entities[pet.id] )

      const newPetIds = newPets.map( pet => pet.id );
      const newPetEntities = newPets.reduce((entities: { [id:number]: Pet }, pet: Pet) => {
        return Object.assign(entities, {
          [pet.id]: pet
        });
      }, {});

      // return the new state
      return {
        ids: [ ...state.ids, ...newPetIds ],
        entities: Object.assign({}, state.entities, newPetEntities),
        selectedPetId: state.selectedPetId
      };
    }

    // pet loaded (GET /pets/:id)
    case pet.ActionTypes.LOAD: {
      const pet = action.payload;

      if (state.ids.indexOf(pet.id) > 1) {
        return state;   // pet already exists in state
      }

      return {
        ids: [ ...state.ids, pet.id ],
        entities: Object.assign({}, state.entities, {
          [pet.id]: pet
        }),
        selectedPetId: state.selectedPetId
      };
    }

    // pet selected in UI
    case pet.ActionTypes.SELECT: {
       return {
         ids: state.ids,
         entities: state.entities,
         selectedPetId: parseInt(action.payload)
       };
    }

    default: {
      return state;
    }
  }
};

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedPetId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

