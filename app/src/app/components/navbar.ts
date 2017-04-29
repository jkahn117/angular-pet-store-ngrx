import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector:    'pet-store-navbar',
  templateUrl: './templates/navbar.html'
})

export class NavBarComponent {
  @Input() username:string;
  @Input() isLoggedIn:boolean;
  @Output() logout = new EventEmitter<any>();

  constructor() {
    this.isLoggedIn = this.isLoggedIn || false;
  }

  onLogout() {
    this.logout.emit();
  }
}