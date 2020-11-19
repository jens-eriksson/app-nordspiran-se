import { DividensProvider } from './../../../../../data/dividends.provider';
import { Dividends } from 'shared/dividend';
import { StockPricesProvider } from './../../../../../data/stock-prices.provider';
import { ReportsProvider } from './../../../../../data/reports.provider';
import { CompanyProvider } from './../../../../../data/company.provider';
import { ModalProvider } from './../../../../../layout/modal.provider';
import { getPriceByDate, StockPrices, calculate as calcStockPrices } from 'shared/stock-prices';
import { Component, OnInit } from '@angular/core';
import { Reports, calculate as calcRaport, getTTMReports, Report, isReady, getReportByDate } from 'shared/report';
import { Company, calculate as calcCompany } from 'shared/company';
import { ImportFileComponent } from '../../../import-file/import-file.component';

@Component({
  selector: 'app-edit-reports',
  templateUrl: './edit-reports.component.html',
  styleUrls: ['./edit-reports.component.scss']
})
export class EditReportsComponent implements OnInit {
  data;
  company: Company;
  stockPrices: StockPrices;
  reports: Reports;
  dividends: Dividends;
  report: Report;

  constructor(
    private modal: ModalProvider,
    private companyProvider: CompanyProvider,
    private reportsProvider: ReportsProvider,
    private stockPricesProvider: StockPricesProvider,
    private dividensProvider: DividensProvider
    ) { }

  ngOnInit(): void {
    this.companyProvider.observe(this.data.id).subscribe(company => {
      this.company = company;
    });
    
    this.stockPricesProvider.observe(this.data.id).subscribe(stockPrices => {
      this.stockPrices = stockPrices;
    });

    this.dividensProvider.observe(this.data.id).subscribe(dividends => {
      this.dividends = dividends;
    })

    this.reportsProvider.observe(this.data.id).subscribe(reports => {
      this.reports = reports;
      if(!this.report) {
        this.report = this.reports.periods[0];
      }
    });
    
  }

  select(report: Report) {
    this.report = report;
  }

  ready(report: Report): boolean {
    return isReady(report);
  }

  calculate() {
    this.reports.periods.forEach(r => {
      const ttms = getTTMReports(r, this.reports.periods);
      if(!r.stockPrice) {
        const priceDay = getPriceByDate(this.stockPrices, r.endDate);
        priceDay ? r.stockPrice = priceDay.stockPrice : null;
      }
      calcRaport(r, ttms);
    });
    this.stockPrices.days.forEach(d => {
      calcStockPrices(d, getReportByDate(this.reports, d.date));
    });
    calcCompany(this.company, this.reports.periods[0], this.stockPrices.days[0], this.dividends.years[0]);
  }

  import() {
    this.modal.open(ImportFileComponent, 500, 300);
  }

  ok() {
    this.calculate();
    this.companyProvider.set(this.company);
    this.reportsProvider.set(this.reports);
    this.stockPricesProvider.set(this.stockPrices);
    this['confirm']();
  }

  cancel() {
    this['cancel']();
  }
}
