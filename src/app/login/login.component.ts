import { Layout } from './../../../shared/layout';
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
  appName = '';
  email: string;
  pwd: string;
  message: string;

  constructor(
    private router: Router,
    private auth: AuthProvider,
    private layoutProvider: LayoutProvider
  ) {
  }

  ngOnInit() {
    this.layoutProvider.layout.subscribe(layout => {
      if (layout) {
        console.log(layout);
        this.appName = layout.appName.toUpperCase();
      }
    });
  }

  login() {
    this.layoutProvider.showLoader();
    if (!this.validate(this.email)) {
      this.message = 'Incorrect email address';
      return;
    }
    this.auth.login(this.email, this.pwd)
    .then(u => {
      this.auth.user.subscribe(user => {
        if (user) {
          this.router.navigate([this.layoutProvider.getActivePath()]);
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
