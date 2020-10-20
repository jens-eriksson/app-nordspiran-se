import { CompanyFilterPipe } from './../../pipes/company-filter.pipe';
import { DividendChartComponent } from './public-company/dividend-chart/dividend-chart.component';
import { BalanceSheetChartComponent } from './public-company/balance-sheet-chart/balance-sheet-chart.component';
import { PricePeChartComponent } from './public-company/price-pe-chart/price-pe-chart.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PublicCompaniesComponent } from './public-companies.component';
import { PublicCompanyComponent } from '../public-companies/public-company/public-company.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReportsComponent } from './public-company/reports/reports.component';
import { LynchChartComponent } from './public-company/lynch-chart/lynch-chart.component';
import { CashflowChartComponent } from './public-company/cashflow-chart/cashflow-chart.component';
import { IncomeStatementChartComponent } from './public-company/income-statement-chart/income-statement-chart.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ImportFileComponent } from './import-file/import-file.component';
import { OverviewComponent } from './public-company/overview/overview.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [
    PublicCompaniesComponent,
    PublicCompanyComponent,
    ReportsComponent,
    LynchChartComponent,
    CashflowChartComponent,
    IncomeStatementChartComponent,
    PricePeChartComponent,
    BalanceSheetChartComponent,
    DividendChartComponent,
    ToolbarComponent,
    ImportFileComponent,
    OverviewComponent,
    CompanyFilterPipe,
    ListComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule
  ]
})
export class PublicCompaniesModule { }
