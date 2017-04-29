import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
//import { DBModule } from '@ngrx/db';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { ComponentsModule } from './components';
import { StoreEffects } from './effects/store';
import { UserEffects } from './effects/user';
import { PetExistsGuard } from './guards/pet-exists';
import { IsLoggedInGuard } from './guards/is-logged-in';

import { AppComponent } from './containers/app';
import { ViewPetPageComponent } from './containers/view-pet-page';
import { SelectedPetPageComponent } from './containers/selected-pet-page';
import { StorePageComponent } from './containers/store-page';
import { LoginPageComponent } from './containers/login-page';
import { LogoutPageComponent } from './containers/logout-page';
import { NewPasswordPageComponent } from './containers/new-password-page';
import { NotFoundPageComponent } from './containers/not-found-page';

import { PetsService } from './services/pets.service';
import { AuthService } from './services/auth.service';
import { CognitoHelper } from './services/cognito-helper';

import { routes } from './app.routes';
import { reducer } from './reducers';
//import { schema } from './db';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ComponentsModule,
    HttpModule,
    RouterModule.forRoot(routes, { useHash: true }),

    /**
     * StoreModule.provideStore is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.provideStore(reducer),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store and uses
     * the store as the single source of truth for the router's state.
     */
    RouterStoreModule.connectRouter(),

    /**
     * Store devtools instrument the store retaining past versions of state
     * and recalculating new states. This enables powerful time-travel
     * debugging.
     *
     * To use the debugger, install the Redux Devtools extension for either
     * Chrome or Firefox
     *
     * See: https://github.com/zalmoxisus/redux-devtools-extension
     */
    StoreDevtoolsModule.instrumentOnlyWithExtension(),

    /**
     * EffectsModule.run() sets up the effects class to be initialized
     * immediately when the application starts.
     *
     * See: https://github.com/ngrx/effects/blob/master/docs/api.md#run
     */
    EffectsModule.run(StoreEffects),
    EffectsModule.run(UserEffects),

    /**
     * `provideDB` sets up @ngrx/db with the provided schema and makes the Database
     * service available.
     */
    //DBModule.provideDB(schema),
  ],
  declarations: [
    AppComponent,
    SelectedPetPageComponent,
    ViewPetPageComponent,
    StorePageComponent,
    LoginPageComponent,
    LogoutPageComponent,
    NewPasswordPageComponent,
    NotFoundPageComponent
  ],
  providers: [
    AuthService,
    CognitoHelper,
    IsLoggedInGuard,
    PetExistsGuard,
    PetsService
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
