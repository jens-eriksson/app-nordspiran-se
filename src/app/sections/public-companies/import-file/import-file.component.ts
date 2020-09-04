import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ExcelDataProvider } from './../../../data/excel-data.provider';
import { StockPricesProvider } from './../../../data/stock-prices.provider';
import { CompanyProvider } from './../../../data/company.provider';
import { Company } from './../../../data/company';
import { StockPrices } from './../../../data/stock-prices';

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.scss']
})
export class ImportFileComponent implements OnInit {
  companies: Company[];
  imports: Company[] = [];
  prices: StockPrices[] = [];
  message: string = null;

  constructor(
    private companyProvider: CompanyProvider,
    private stockPricesProvider: StockPricesProvider,
    private excelDataProvider: ExcelDataProvider
  ) {
    this.companyProvider.all('name', 'asc').subscribe(companies => {
      this.companies = companies;
    });
  }

  ngOnInit() {
  }

  import(event) {
    let i = 0;
    for (i = 0; i < event.target.files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => this.parseXlsxFile(reader);
      reader.readAsBinaryString(event.target.files[i]);
    }
  }

  parseXlsxFile(reader) {
    const workbook = XLSX.read(reader.result, { type: 'binary'});
    const imported = this.excelDataProvider.getCompany(workbook);
    const company = this.companies.find(c => c.id === imported.id);

    if (company) {
      company.reports.filter(r => r.type === 'q').forEach(existing => {
        const report = imported.reports.filter(r1 => r1.type === 'y').find(r2 => r2.period === existing.period);
        if (report) {
          imported.reports = imported.reports.filter(r => r.period !== existing.period);
          imported.reports.push(existing);
        }
      });
    }

    const existingImport = this.imports.find(c => c.id === imported.id);
    if (existingImport) {
      if (existingImport.updated < imported.updated) {
        this.imports = this.imports.filter(c => c.id !== imported.id);
        this.prices = this.prices.filter(p => p.id !== imported.id);
        this.imports.push(imported);
        this.prices.push(this.excelDataProvider.getStockPrices(workbook));
      }
    } else {
      this.imports.push(imported);
      this.prices.push(this.excelDataProvider.getStockPrices(workbook));
    }
  }

  confirm() {
    for (const company of this.imports) {
      this.companyProvider.set(company);
    }
    for (const stockPrices of this.prices) {
      this.stockPricesProvider.set(stockPrices);
    }
    this['close']();
  }

  cancel() {
    this['close']();
  }
}
