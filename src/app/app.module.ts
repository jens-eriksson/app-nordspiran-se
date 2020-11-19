import { DividensProvider } from './data/dividends.provider';
import { ReportsProvider } from './data/reports.provider';
import { ListProvider } from './data/list.provider';
import { PageStateProvider } from './data/page-state.provider';
import * as firebase from 'firebase';
import { environment } from '../environments/environment';
import { ChartProvider } from './chart.provider';
import { StockPricesProvider } from './data/stock-prices.provider';
import { CompaniesModule } from './sections/companies/companies.module';
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

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { PasswordResetComponent } from './login/password-reset/password-reset.component';
import localeSv from '@angular/common/locales/sv';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeSv, 'sv');
firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordResetComponent
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CompaniesModule
  ],
  providers: [
    AuthProvider,
    AuthGuard,
    UserProvider,
    CompanyProvider,
    StockPricesProvider,
    ReportsProvider,
    DividensProvider,
    ExcelDataProvider,
    ChartProvider,
    PageStateProvider,
    ListProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
