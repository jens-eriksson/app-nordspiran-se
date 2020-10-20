import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ExcelDataProvider } from './../../../data/excel-data.provider';
import { StockPricesProvider } from './../../../data/stock-prices.provider';
import { CompanyProvider } from './../../../data/company.provider';
import { Company } from './../../../../../shared/company';
import { StockPrices } from './../../../../../shared/stock-prices';

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
  fileCount: number;

  constructor(
    private companyProvider: CompanyProvider,
    private stockPricesProvider: StockPricesProvider,
    private excelDataProvider: ExcelDataProvider
  ) {
    this.companyProvider.listener().subscribe(companies => {
      this.companies = companies;
    });
  }

  ngOnInit() {
  }

  import(event) {
    let i = 0;
    this.fileCount = event.target.files.length;
    for (i = 0; i < event.target.files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => this.parseXlsxFile(reader);
      reader.readAsBinaryString(event.target.files[i]);
    }
  }

  parseXlsxFile(reader) {
    try {
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
    catch(err) {
      console.error(err);
      this.fileCount = this.fileCount--;
    }
  }

  ok() {
    for (const company of this.imports) {
      this.companyProvider.set(company).catch(err => {
        this.message += company.name + ':' + err.message +'\r\n'; 
      });
    }
    for (const stockPrices of this.prices) {
      this.stockPricesProvider.set(stockPrices).catch(err => {
        this.message += stockPrices.id + ':' + err.message +'\r\n'; 
      })
    }
    this['confirm']();
  }

  cancel() {
    this['cancel']();
  }
}
