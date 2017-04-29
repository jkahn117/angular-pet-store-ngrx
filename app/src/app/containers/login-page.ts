import 'rxjs/add/operator/let';

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../reducers';
import * as userActions from '../actions/user';
import { User } from '../models/user';


@Component({
  selector: 'login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <login
      [message]="message$"
      (login)="doLogin($event)" >
    </login>
  `
})


export class LoginPageComponent {
  message$:string;

  constructor(
    private store:Store<fromRoot.State>
  ) { }

  doLogin($event) {
    this.store.dispatch(
      new userActions.LoginAction({
        username: $event.username,
        password: $event.password
      })
    );
  }
}