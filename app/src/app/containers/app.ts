import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../reducers';
import * as userActions from '../actions/user';

@Component({
  selector: 'pet-store-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  //styleUrls: ['./app.component.css'],
  template: `
    <!-- top navigation bar -->
    <pet-store-navbar
      [isLoggedIn]="isLoggedIn$ | async"
      [username]="username$ | async"
      (logout)="doLogout()">
    </pet-store-navbar>

    <!-- main body -->
    <div class="container-fluid">
      <div class="row">
        <!-- left menu -->
        <div class="col-sm-3 col-md-2 sidebar">
          <pet-store-menu></pet-store-menu>
        </div>

        <!-- content -->
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})


export class AppComponent {
  username$:Observable<string>;
  isLoggedIn$:Observable<boolean>;

  constructor(private store:Store<fromRoot.State>) {
    this.username$   = store.select(fromRoot.getCurrentUserName);
    this.isLoggedIn$ = store.select(fromRoot.isLoggedIn);
  }

  doLogout() {
    this.store.dispatch( new userActions.LogoutAction );
  }
}