import { LayoutState } from './../layout/layout';
import { LayoutProvider } from './../layout/layout.provider';
import { AuthProvider } from './../auth/auth.provider';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  pwd: string;
  message: string;
  layoutState: LayoutState;

  constructor(
    private router: Router,
    private auth: AuthProvider,
    private layout: LayoutProvider
  ) {
  }

  ngOnInit() {
    this.layout.layoutState.subscribe(layoutState => {
      this.layoutState = layoutState;
    });
  }

  login() {
    this.layout.showLoader();
    if (!this.validate(this.email)) {
      this.message = 'Incorrect email address';
      return;
    }
    this.auth.login(this.email, this.pwd)
    .then(u => {
      this.auth.user.subscribe(user => {
        if (user) {
          this.router.navigate([this.layoutState.activePath]);
        }
      });
    })
    .catch(err => {
      this.message = err.message;
    });
  }

  resetPassword() {
    this.router.navigate(['/password-reset']);
  }

  validate(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
