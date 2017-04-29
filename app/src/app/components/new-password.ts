import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  OnInit,
  EventEmitter
} from '@angular/core';

@Component({
  selector:    'new-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:  './templates/new-password.html'
})

export class NewPasswordComponent implements OnInit {
  @Input() username:string;
  @Input() message:string;
  oldPassword:string;
  newPassword:string;
  confirmPassword:string;
  
  @Output() changePassword = new EventEmitter<any>();

  ngOnInit() {
    this.message = null;
  }

  onSubmit() {
    if (this.username == null || this.newPassword == null || this.changePassword == null) {
      this.message = "Username and passwords are required";
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = "Password and confirmation must match";
      return;
    }

    this.message = null;

    var change = {
      username:    this.username,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.changePassword.emit(change);
  }
}
