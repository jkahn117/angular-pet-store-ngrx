import 'rxjs/add/operator/let';

import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../reducers';
import * as userActions from '../actions/user';
import { User } from '../models/user';


@Component({
  selector: 'logout-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``
})


export class LogoutPageComponent {

  constructor(
    private store:Store<fromRoot.State>
  ) { }

  ngOnInit() {
    console.log('Logout');
    this.store.dispatch( new userActions.LogoutAction() );
  }
}