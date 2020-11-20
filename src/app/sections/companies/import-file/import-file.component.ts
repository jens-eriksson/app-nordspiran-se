import { LayoutProvider } from 'src/app/layout/layout.provider';
import { DividensProvider } from './../../../data/dividends.provider';
import { ReportsProvider } from './../../../data/reports.provider';
import { Reports, calculate as calculateReport, merge as mergeReports, getTTMReports, getReportByDate, getLatestReport, convertPeriod } from './../../../../../shared/report';
import { Dividends, merge as mergeDividends, Dividend } from './../../../../../shared/dividend';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ExcelDataProvider } from './../../../data/excel-data.provider';
import { StockPricesProvider } from './../../../data/stock-prices.provider';
import { CompanyProvider } from './../../../data/company.provider';
import { Company, calculate as calculateCompany, merge as mergeCompany } from './../../../../../shared/company';
import { StockPrices, calculate as calculateStockPrice, getPriceByDate, merge as mergeStockPrices } from './../../../../../shared/stock-prices';

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.scss']
})
export class ImportFileComponent implements OnInit {
  companies: Company[] = [];
  stockPrices: StockPrices[] = [];
  dividends: Dividends[] = [];
  reports: Reports[] = [];

  message: string = null;
  fileCount: number;

  constructor(
    private companyProvider: CompanyProvider,
    private reportsProvider: ReportsProvider,
    private stockPricesProvider: StockPricesProvider,
    private dividendProvider: DividensProvider,
    private excelDataProvider: ExcelDataProvider,
    private layoutProvider: LayoutProvider
  ) {
  }

  ngOnInit() {
  }

  import(event) {
    this.layoutProvider.showLoader();
    let i = 0;
    this.fileCount = event.target.files.length;
    for (i = 0; i < event.target.files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => this.parseXlsxFile(reader);
      reader.readAsBinaryString(event.target.files[i]);
    }
    this.layoutProvider.hideLoader();
  }

  async parseXlsxFile(reader) {
    try {
      const workbook = XLSX.read(reader.result, { type: 'binary'});

      const impCompany = this.excelDataProvider.getCompany(workbook);
      let company = await this.companyProvider.get(impCompany.id);
      if(company) {
        impCompany.fiscalYearEnd = company.fiscalYearEnd;
      }
      
      const impStockPrices = this.excelDataProvider.getStockPrices(workbook);
      const impDividends = this.excelDataProvider.getDividends(workbook);
      const impReports = this.excelDataProvider.getReports(workbook);    

      this.companies.push(impCompany);
      this.reports.push(impReports);
      this.stockPrices.push(impStockPrices);
      this.dividends.push(impDividends);
    }
    catch(err) {
      console.error(err);
      this.fileCount = this.fileCount--;
    }
  }

  convertPeriods() {
    for (const reports of this.reports) {
      const company = this.companies.find(c => c.id === reports.id);
      reports.periods.forEach(r => {
        convertPeriod(r, company.fiscalYearEnd);
      });
    }
  }

  async mergeWithExisting() {
    const companies: Company[] = [];
    const stockPrices: StockPrices[] = [];
    const dividends: Dividends[] = [];
    const reports: Reports[] = [];
    
    for (const impCompany of this.companies) {
      let company = await this.companyProvider.get(impCompany.id);
      let stockPrice = await this.stockPricesProvider.get(impCompany.id);
      let dividend = await this.dividendProvider.get(impCompany.id);
      let report = await this.reportsProvider.get(impCompany.id);

      const impStockPrices = this.stockPrices.find(s => s.id === impCompany.id);
      const impDividend = this.dividends.find(d => d.id === impCompany.id);
      const impReports = this.reports.find(r => r.id === impCompany.id);

      company = mergeCompany(company, impCompany);
      dividend = mergeDividends(dividend, impDividend);
      report = mergeReports(report, impReports);
      stockPrice = mergeStockPrices(stockPrice, impStockPrices);

      companies.push(company);
      stockPrices.push(stockPrice);
      dividends.push(dividend);
      reports.push(report);
    }

    this.companies = companies;
    this.stockPrices = stockPrices;
    this.dividends = dividends;
    this.reports = reports;
  }

  calculate() {
    // Calculate reports
    for (const reports of this.reports) {
      const prices = this.stockPrices.find(s => s.id === reports.id);
      reports.periods.forEach(r => {
        const priceDay = getPriceByDate(prices, r.endDate);
        if(priceDay) {
          r.stockPrice = priceDay.stockPrice;
        }
        calculateReport(r, getTTMReports(r, reports.periods));
      });
    }
    // Calculate stock prices
    for (const stockPrices of this.stockPrices) {
      const reports = this.reports.find(r => r.id === stockPrices.id);
      stockPrices.days.forEach(d => {
        const report = getReportByDate(reports, d.date);
        calculateStockPrice(d, report);
      });
    }
    //Calculate companies
    for (const company of this.companies) {
      let r = this.reports.find(r => r.id === company.id);
      let p = this.stockPrices.find(s => s.id === company.id);
      let d = this.dividends.find(d => d.id === company.id);
      calculateCompany(company, getLatestReport(r), p.days[0], d.years[0]);
    }
  }

  save() {
    // Save reports
    for (const reports of this.reports) {
      this.reportsProvider.set(reports);
    }
    // Save stock prices
    for (const stockPrices of this.stockPrices) {
      this.stockPricesProvider.set(stockPrices);
    }
    // Save dividends
    for (const dividends of this.dividends) {
      this.dividendProvider.set(dividends);
    }
    //Save companies
    for (const company of this.companies) {
      this.companyProvider.set(company);
    }
  }

  ok() {
    this.convertPeriods();
    this.mergeWithExisting().then(() => {
      this.calculate();
      this.save();
      this['confirm']();
    });
  }

  cancel() {
    this['cancel']();
  }

  delete() {
    this.companyProvider.all().then(all => {
      all.forEach(c => {
        this.companyProvider.delete(c.id);
      });
    });
    this.dividendProvider.all().then(all => {
      all.forEach(c => {
        this.dividendProvider.delete(c.id);
      });
    });
    this.reportsProvider.all().then(all => {
      all.forEach(c => {
        this.reportsProvider.delete(c.id);
      });
    });
    this.stockPricesProvider.all().then(all => {
      all.forEach(c => {
        this.stockPricesProvider.delete(c.id);
      });
    });
  }
}
