import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { AuthService } from '../services/auth.service';
import * as fromRoot from '../reducers';
import * as storeActions from '../actions/store';

/**
 * Only allows users to browse to pages if they are logged in; else
 * sends to the login page.
 */
@Injectable()
export class IsLoggedInGuard implements CanActivate {
  constructor(
    private router:Router,
    private authService:AuthService,
    private store:Store<fromRoot.State>
  ) { }

  private hasSessionInStore(): Observable<boolean> {
    return this.store.select(fromRoot.isLoggedIn)
      .map(isLoggedIn => isLoggedIn)
      .take(1);
  }

  private hasSessionInCognito(): Observable<boolean> {
    return this.authService.isLoggedIn()
      .map( isLoggedIn => isLoggedIn )
      .take(1);
  }

  private isLoggedIn(): Observable<boolean> {
    return this.hasSessionInStore()
      .switchMap(hasSessionInStore => {
        if (hasSessionInStore) {
          return of (hasSessionInStore);
        }

        return this.hasSessionInCognito();
      })
  }

  /**
   * Called when the guard is run. Checks if there is a currently logged in
   * user, either in the `Store` (session) or has a Cognito session.  If
   * logged in, continues to desired route; else sends to `/login` page.
   * 
   * The current approach may not be ideal as we may not need to load
   * the store each time the user logs in from Cognito session.
   * 
   * @param next 
   * @param state 
   */
  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot): Observable<boolean> {
    return this.isLoggedIn()
      .switchMap( isLoggedIn => {
        if (isLoggedIn) {
          this.store.dispatch(new storeActions.LoadAction());
          return of (isLoggedIn);
        }
        
        this.router.navigate(['/login']);
        return of(isLoggedIn);
      })
      .catch( () => {
        this.router.navigate(['/login']);
        return of(false);
      });
  }
}