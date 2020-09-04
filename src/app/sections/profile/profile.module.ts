import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    ProfileComponent,
    EditProfileComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ProfileComponent,
    EditProfileComponent,
    ChangePasswordComponent
  ],
  providers: [
  ]
})
export class ProfilePageModule { }
