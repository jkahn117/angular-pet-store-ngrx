import 'rxjs/add/operator/let';

import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../reducers';
import * as storeActions from '../actions/store';
import { Pet } from '../models/pet';


@Component({
  selector: 'store-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './templates/store-page.html'
})


export class StorePageComponent {
  pets$: Observable<Pet[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.pets$ = store.select(fromRoot.getPetStore);
    this.loading$ = store.select(fromRoot.getStoreLoading);
  }

  ngOnInit() {
    this.store.dispatch(new storeActions.LoadAction());
  }
  
}