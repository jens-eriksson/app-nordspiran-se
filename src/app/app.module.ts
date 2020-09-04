import { ChartProvider } from './chart.provider';
import { StockPricesProvider } from './data/stock-prices.provider';
import { PublicCompaniesModule } from './sections/public-companies/public-companies.module';
import { ExcelDataProvider } from './data/excel-data.provider';
import { HttpClientModule } from '@angular/common/http';
import { CompanyProvider } from './data/company.provider';
import { UserProvider } from './data/user.provider';
import { AuthProvider } from './auth/auth.provider';
import { AuthGuard } from './auth/auth-guard.provider';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { LayoutModule } from './layout/layout.module';
import { PasswordResetComponent } from './login/password-reset/password-reset.component';
import localeSv from '@angular/common/locales/sv';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeSv, 'sv');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordResetComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    LayoutModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    PublicCompaniesModule
  ],
  providers: [
    AuthGuard,
    AuthProvider,
    AngularFireAuthGuard,
    UserProvider,
    CompanyProvider,
    StockPricesProvider,
    ExcelDataProvider,
    ChartProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
