//---- REDUCER: index

import { createSelector } from 'reselect';
import { ActionReducer } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { environment } from '../../environments/environment';

/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
import { compose } from '@ngrx/core/compose';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { combineReducers } from '@ngrx/store';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromPets  from './pets';
import * as fromStore from './store';
import * as fromUser  from './user';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  pets:  fromPets.State;
  store: fromStore.State;
  user:  fromUser.State;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  pets:   fromPets.reducer,
  store:  fromStore.reducer,
  user:   fromUser.reducer,
  router: fromRouter.routerReducer
};

const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (environment.production) {
    return productionReducer(state, action);
  }
  else {
    return developmentReducer(state, action);
  }
}

/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `pets` state.
 *
 * Selectors are used with the `select` operator.
 *
 * ```ts
 * class MyComponent {
 *   constructor(state$: Observable<State>) {
 *     this.petsState$ = state$.select(getPetsState);
 *   }
 * }
 * ```
 */
export const getPetsState = (state: State) => state.pets;

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 *
 * The createSelector function from the reselect library creates
 * very efficient selectors that are memoized and only recompute when arguments change.
 * The created selectors can also be composed together to select different
 * pieces of state.
 */
export const getPetEntities = createSelector(getPetsState, fromPets.getEntities);
export const getPetIds = createSelector(getPetsState, fromPets.getIds);
export const getSelectedPetId = createSelector(getPetsState, fromPets.getSelectedId);
export const getSelectedPet = createSelector(getPetsState, fromPets.getSelected);


//--- Store
export const getStoreState = (state: State) => state.store;

export const getStoreLoaded = createSelector(getStoreState, fromStore.getLoaded);
export const getStoreLoading = createSelector(getStoreState, fromStore.getLoading);
export const getStorePetIds = createSelector(getStoreState, fromStore.getIds);

export const getPetStore = createSelector(getPetEntities, getStorePetIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const isSelectedPetInStore = createSelector(getStorePetIds, getSelectedPetId, (ids, selected) => {
  return ids.indexOf(selected) > -1;
});

//--- User
export const getUserState = (state:State) => state.user;

export const getCurrentUser = createSelector(getUserState, fromUser.getCurrentUser);

export const getCurrentUserName = createSelector(getUserState, fromUser.getCurrentUserName);

export const getCurrentUserAttributes = createSelector(getUserState, fromUser.getCurrentUserAttribuets);

export const isLoggedIn = createSelector(getCurrentUser, (user) => {
  return (user !== undefined && user !== null);
})

