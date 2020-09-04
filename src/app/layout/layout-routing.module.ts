import { PublicCompanyComponent } from './../sections/public-companies/public-company/public-company.component';
import { PublicCompaniesComponent } from './../sections/public-companies/public-companies.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from './../auth/auth-guard.provider';
import { RealEstateListComponent } from './../sections/real-estate/real-estate-list.component';
import { RealEstateComponent } from './../sections/real-estate/real-estate/real-estate.component';
import { ProfileComponent } from './../sections/profile/profile.component';
import { ChangePasswordComponent } from './../sections/profile/change-password/change-password.component';
import { EditProfileComponent } from './../sections/profile/edit-profile/edit-profile.component';

export const ROUTES: Routes = [
  { path: 'companies',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: PublicCompaniesComponent },
      { path: ':id', component: PublicCompanyComponent }
    ]
  },
  { path: 'real-estate',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RealEstateListComponent },
      { path: ':id', component: RealEstateComponent }
    ]
  },
  { path: 'profile',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProfileComponent},
      { path: 'edit-profile', component: EditProfileComponent },
      { path: 'change-password', component: ChangePasswordComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES)
  ],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
