import { UserProvider } from './../../../data/user.provider';
import { Router } from '@angular/router';
import { AuthProvider } from './../../../auth/auth.provider';
import { Component, OnInit } from '@angular/core';
import { User } from './../../../../../shared/user';
import { LayoutProvider } from 'src/app/layout/layout.provider';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  user: User;
  displayName: string;
  message: string;

  constructor(
    private auth: AuthProvider,
    private userProvider: UserProvider,
    private layout: LayoutProvider,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      this.user = user;
      this.displayName = null;
      if (this.user) {
        this.displayName = user.displayName;
      }
    });
  }

  save() {
    this.user.displayName = this.displayName;
    this.layout.showLoader();
    this.userProvider.set(this.user).then(() => {
      this.router.navigate(['/profile']);
    })
    .catch(err => {
      this.layout.hideLoader();
      this.message = err.message;
    });
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}
