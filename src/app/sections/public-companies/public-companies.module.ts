import { DividendChartComponent } from './public-company/dividend-chart/dividend-chart.component';
import { BalanceSheetChartComponent } from './public-company/balance-sheet-chart/balance-sheet-chart.component';
import { PricePeChartComponent } from './public-company/price-pe-chart/price-pe-chart.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicCompaniesComponent } from './public-companies.component';
import { PublicCompanyComponent } from '../public-companies/public-company/public-company.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReportsComponent } from './public-company/reports/reports.component';
import { LynchChartComponent } from './public-company/lynch-chart/lynch-chart.component';
import { CashflowChartComponent } from './public-company/cashflow-chart/cashflow-chart.component';
import { RevenueNetIncomeChartComponent } from './public-company/revenue-netincome-chart/revenue-netincome-chart.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ImportFileComponent } from './import-file/import-file.component';
import { OverviewComponent } from './public-company/overview/overview.component';

@NgModule({
  declarations: [
    PublicCompaniesComponent,
    PublicCompanyComponent,
    ReportsComponent,
    LynchChartComponent,
    CashflowChartComponent,
    RevenueNetIncomeChartComponent,
    PricePeChartComponent,
    BalanceSheetChartComponent,
    DividendChartComponent,
    ToolbarComponent,
    ImportFileComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    BrowserModule
  ]
})
export class PublicCompaniesModule { }
