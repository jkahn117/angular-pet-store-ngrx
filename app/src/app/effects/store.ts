import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';

import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
//import { Database } from '@ngrx/db';

import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import * as store from '../actions/store';
import { Pet } from '../models/pet';
import { PetsService } from '../services/pets.service';


@Injectable()
export class StoreEffects {

  constructor(
    private actions$:Actions,
    private petsService:PetsService
  ) { }

  @Effect()
  navigateToStore$: Observable<Action> = this.actions$
    .ofType(store.ActionTypes.SHOW_STORE)
    .startWith(new store.ShowStoreAction())
    .map(() => go([ '/pets' ]));


  @Effect()
  loadStore$: Observable<Action> = this.actions$
    // listen for the store#LOAD action
    .ofType(store.ActionTypes.LOAD)
    //.startWith(new store.LoadAction())
    .map(toPayload)
    .switchMap( () => {
      // TODO: what does skip(1) do?
      const nextLoad$ = this.actions$.ofType(store.ActionTypes.LOAD).skip(1);
      return this.petsService.getPets()
        .takeUntil(nextLoad$)
        .map( pets => new store.LoadSuccessAction(pets) )
        .catch( () => of(new store.LoadFailAction([])) )
    });


}

