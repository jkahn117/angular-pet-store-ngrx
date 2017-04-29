import 'rxjs/add/operator/let';

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../reducers';
import * as userActions from '../actions/user';
import { User } from '../models/user';


@Component({
  selector: 'new-password-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <new-password
      [message]="message$ | async"
      [username]="username$ | async"
      (changePassword)="doChangePassword($event)">
    </new-password>
  `
})


export class NewPasswordPageComponent {
  isLoggedIn$:Observable<boolean>;
  username$:Observable<string>;
  message$:string;

  constructor(private store:Store<fromRoot.State>) {
    this.username$   = store.select(fromRoot.getCurrentUserName);
    this.isLoggedIn$ = store.select(fromRoot.isLoggedIn);
  }

  doChangePassword($event) {
    this.store.dispatch(
      new userActions.NewPasswordAction({
        username:      $event.username,
        newPassword:   $event.newPassword
      })
    );
  }
}