import { EditReportsComponent } from './reports/edit-reports/edit-reports.component';
import { ModalProvider } from './../../../layout/modal.provider';
import { DividensProvider } from './../../../data/dividends.provider';
import { StockPricesProvider } from './../../../data/stock-prices.provider';
import { ReportsProvider } from './../../../data/reports.provider';
import { CompanyProvider } from './../../../data/company.provider';
import { Company } from './../../../../../shared/company';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Reports } from 'shared/report';
import { StockPrices } from 'shared/stock-prices';
import { Dividends } from 'shared/dividend';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  company: Company;
  reports: Reports;
  stockPrices: StockPrices;
  dividends: Dividends;

  constructor(
    private route: ActivatedRoute, 
    private companyProvider: CompanyProvider,
    private reportsProvider: ReportsProvider,
    private stockPricesProvider: StockPricesProvider,
    private dividendsProvider: DividensProvider,
    private modalProvider: ModalProvider,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.companyProvider.observe(this.route.snapshot.params.id).subscribe(company => {
          this.company = company;
        });
    
        this.reportsProvider.observe(this.route.snapshot.params.id).subscribe(reports => {
          this.reports = reports;
        });
    
        this.stockPricesProvider.observe(this.route.snapshot.params.id).subscribe(stockPrices => {
          this.stockPrices = stockPrices;
        });
    
        this.dividendsProvider.observe(this.route.snapshot.params.id).subscribe(dividends => {
          this.dividends = dividends;
        });
      }
    });
  }

  ngOnInit() {
    
  }

  edit() {
    this.modalProvider.open(EditReportsComponent, null, null, { reports: this.reports, stockPrices: this.stockPrices, company: this.company });
  }
}
