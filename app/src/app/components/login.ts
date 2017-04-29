import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  OnInit,
  EventEmitter
} from '@angular/core';

@Component({
  selector:    'login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:  './templates/login.html'
})

export class LoginComponent implements OnInit {
  username:string;
  password:string;
  @Input() message:string;

  @Output() login = new EventEmitter<any>();

  ngOnInit() {
    this.message = null;
  }

  onLogin() {
    if (this.username == null || this.password == null) {
      this.message = "Username and password are required";
      return;
    }

    this.message = null;

    var auth = {
      username: this.username,
      password: this.password
    };

    this.login.emit(auth);
  }
}