import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../reducers';
import * as petStore from '../actions/store';
import { Pet } from '../models/pet';


@Component({
  selector: 'selected-pet-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pet-detail
      [pet]="pet$ | async"
      [inStore]="isSelectedPetInStore$ | async"
      (add)="addToStore($event)">
    </pet-detail>
  `
})


export class SelectedPetPageComponent {
  pet$: Observable<Pet>;
  isSelectedPetInStore$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.pet$ = store.select(fromRoot.getSelectedPet);
    this.isSelectedPetInStore$ = store.select(fromRoot.isSelectedPetInStore);
  }

  addToStore(pet:Pet) {
    this.store.dispatch(new petStore.AddPetAction(pet));
  }

  /*removeFromCollection(book: Book) {
    this.store.dispatch(new collection.RemoveBookAction(book));
  }*/
}