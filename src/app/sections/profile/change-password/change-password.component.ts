import { LayoutProvider } from './../../../layout/layout.provider';
import { Router } from '@angular/router';
import { AuthProvider } from './../../../auth/auth.provider';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  password: string;
  confirmPassword: string;
  message: string;

  constructor(
    private auth: AuthProvider,
    private router: Router,
    private layout: LayoutProvider
    ) { }

  ngOnInit(): void {
  }

  save() {
    this.message = '';
    if (this.password && this.confirmPassword && this.password === this.confirmPassword) {
      this.layout.showLoader();
      this.auth.changePassword(this.password).then(() => {
        this.router.navigate(['/profile']);
      })
      .catch(err => {
        this.layout.hideLoader();
        this.message = err.message;
      });
    } else {
      this.message = 'Passowords does not match';
    }
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}
