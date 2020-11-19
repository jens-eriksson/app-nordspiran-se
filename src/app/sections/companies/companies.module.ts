import { CompanyFilterPipe } from './../../pipes/company-filter.pipe';
import { DividendChartComponent } from './company/dividend-chart/dividend-chart.component';
import { BalanceSheetChartComponent } from './company/balance-sheet-chart/balance-sheet-chart.component';
import { PricePeChartComponent } from './company/price-pe-chart/price-pe-chart.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompaniesComponent } from './companies.component';
import { CompanyComponent } from '../companies/company/company.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReportsComponent } from './company/reports/reports.component';
import { LynchChartComponent } from './company/lynch-chart/lynch-chart.component';
import { CashflowChartComponent } from './company/cashflow-chart/cashflow-chart.component';
import { IncomeStatementChartComponent } from './company/income-statement-chart/income-statement-chart.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ImportFileComponent } from './import-file/import-file.component';
import { OverviewComponent } from './company/overview/overview.component';
import { ListComponent } from './list/list.component';
import { EditReportsComponent } from './company/reports/edit-reports/edit-reports.component';

@NgModule({
  declarations: [
    CompaniesComponent,
    CompanyComponent,
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
    ListComponent,
    EditReportsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule
  ]
})
export class CompaniesModule { }
