import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';

import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import * as fromRoot from '../reducers';
import * as pet from '../actions/pet';

/**
 * Note: Container components are also reusable. Whether or not
 * a component is a presentation component or a container
 * component is an implementation detail.
 *
 * The View Pet Page's responsibility is to map router params
 * to a 'Select' pet action. Actually showing the selected
 * pet remains a responsibility of the
 * SelectedPetPageComponent
 */

@Component({
  selector: 'view-pet-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <selected-pet-page></selected-pet-page>
  `
})

export class ViewPetPageComponent implements OnDestroy {
  actionsSubscription: Subscription;

  constructor(store:Store<fromRoot.State>, route:ActivatedRoute) {
    this.actionsSubscription = route.params
      .select<string>('id')
      .map( id => new pet.SelectAction(id) )
      .subscribe(store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}