import { AuthProvider } from './../../auth/auth.provider';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  email: string;
  message: string;

  constructor(
    private router: Router,
    private auth: AuthProvider
  ) {
  }

  ngOnInit(): void {
  }

  resetPassword() {
    if (!this.validate(this.email)) {
      this.message = 'Incorrect email address';
      return;
    }
    this.auth.resetPassword(this.email)
    .then(() => {
      this.router.navigate(['/login']);
    })
    .catch(err => {
      this.message = err.message;
    });
  }

  validate(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
