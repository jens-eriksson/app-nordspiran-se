import { LayoutProvider } from './../../layout/layout.provider';
import { Page, Tab } from './../../../../shared/layout';
import { Router } from '@angular/router';
import { AuthProvider } from './../../auth/auth.provider';
import { Component, OnInit } from '@angular/core';
import { User } from './../../../../shared/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;

  constructor(
    private auth: AuthProvider,
    private router: Router,
    private layoutProvider: LayoutProvider
    ) { }

  ngOnInit() {
    const tab = this.layoutProvider.newTab(
      [
        '/profile',
        '/profile/edit-profile',
        '/profile/change-password'
      ],
      'My Profile',
      false);
    this.layoutProvider.openTab(tab);

    this.auth.user.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  edit() {
    this.router.navigate(['/profile/edit-profile']);
  }

  changePassword() {
    this.router.navigate(['/profile/change-password']);
  }
}
