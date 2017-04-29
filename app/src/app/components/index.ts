import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MenuComponent } from './menu';
import { NavBarComponent } from  './navbar';

import { PetDetailComponent } from './pet-detail';

import { LoginComponent } from './login';
import { NewPasswordComponent } from './new-password';


export const COMPONENTS = [
  MenuComponent,
  NavBarComponent,
  PetDetailComponent,
  LoginComponent,
  NewPasswordComponent,
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS
})

export class ComponentsModule { }