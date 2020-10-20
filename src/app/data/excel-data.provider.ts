import { ExcelDataParser } from './../../../shared/excel-data.parser';
import { Company } from './../../../shared/company';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { StockPrices } from './../../../shared/stock-prices';

@Injectable()
export class ExcelDataProvider {
    private parser = new ExcelDataParser();

    getCompany(workbook: XLSX.WorkBook): Company {
        return this.parser.getCompany(workbook);
    }

    getStockPrices(workbook: XLSX.WorkBook): StockPrices {
        return this.parser.getStockPrices(workbook);
    }
}
