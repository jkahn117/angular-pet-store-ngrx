import { Routes } from '@angular/router';

import { PetExistsGuard } from './guards/pet-exists';
import { IsLoggedInGuard } from './guards/is-logged-in';

import { StorePageComponent } from './containers/store-page';
import { ViewPetPageComponent } from './containers/view-pet-page';
import { SelectedPetPageComponent } from './containers/selected-pet-page';
import { LoginPageComponent } from './containers/login-page';
import { LogoutPageComponent } from './containers/logout-page';
import { NewPasswordPageComponent } from  './containers/new-password-page';
import { NotFoundPageComponent } from './containers/not-found-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/pets',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'logout',
    canActivate: [ IsLoggedInGuard ],
    component: LogoutPageComponent
  },
  {
    // use Guard to prevent navigating to the new password page without a username
    path: 'newpassword',
    component: NewPasswordPageComponent
  },
  {
    path: 'pets',
    canActivate: [ IsLoggedInGuard ],
    component: StorePageComponent
  },
  {
    path: 'pets/:id',
    canActivate: [ PetExistsGuard, IsLoggedInGuard ],
    component: ViewPetPageComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];