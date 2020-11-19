import { firestore } from 'firebase';
import { Dividend, Dividends } from './dividend';
import { Report, Reports, sort as sortReports } from './report';
import { Company } from './company';
import * as XLSX from 'xlsx';
import { StockPrices, PriceDay, sort as sortStockPrices } from './stock-prices';

export class ExcelDataParser {
    public getCompany(workbook: XLSX.WorkBook): Company {
        const company: Company = {
            id: this.generateId(workbook.Sheets.Info.C15.v),
            borsdataId: workbook.Sheets.Info.C18 ? workbook.Sheets.Info.C18.v : null,
            name: workbook.Sheets.Info.C15 ? workbook.Sheets.Info.C15.v : null,
            ticker: workbook.Sheets.Info.C16 ? workbook.Sheets.Info.C16.v : null,
            stockPriceCurrency: workbook.Sheets.Info.C27 ? workbook.Sheets.Info.C27.v : null,
            reportCurrency: workbook.Sheets.Info.C28 ? workbook.Sheets.Info.C28.v : null,
            updated: firestore.Timestamp.fromDate(new Date(workbook.Sheets.Info.C14.w)),
            fiscalYearEnd: 12
        };

        return company;
    }

    public getStockPrices(workbook: XLSX.WorkBook): StockPrices {
        const stockPrices: StockPrices = {
            id: this.generateId(workbook.Sheets.Info.C15.v),
            currency: workbook.Sheets.Info.C27 ? workbook.Sheets.Info.C27.v : null,
            days: []
        };
        for (const cell in workbook.Sheets.PriceDay) {
            if (cell.startsWith('A') && cell !== 'A1') {
                const day: PriceDay = {
                    date: firestore.Timestamp.fromDate(new Date(workbook.Sheets.PriceDay[cell].v)),
                    stockPrice: workbook.Sheets.PriceDay[cell.replace('A', 'E')].v
                };
                stockPrices.days.push(day);
            }
        }

        return sortStockPrices(stockPrices);
    }

    public getReports(workbook: XLSX.WorkBook): Reports {
        let periods: Report[] = this.createPeriods();   

        let year = this.parseYear(workbook, 'C');
        year.forEach(r => {
            periods = this.addReport(periods, r);
        });
        year = this.parseYear(workbook, 'D');
        year.forEach(r => {
            periods = this.addReport(periods, r);
        });
        year = this.parseYear(workbook, 'E');
        year.forEach(r => {
            periods = this.addReport(periods, r);
        });
        year = this.parseYear(workbook, 'F');
        year.forEach(r => {
            periods = this.addReport(periods, r);
        });
        year = this.parseYear(workbook, 'G');
        year.forEach(r => {
            periods = this.addReport(periods, r);
        });
        year = this.parseYear(workbook, 'H');
        year.forEach(r => {
            periods = this.addReport(periods, r);
        });
        year = this.parseYear(workbook, 'I');
        year.forEach(r => {
            periods = this.addReport(periods, r);
        });
        year = this.parseYear(workbook, 'J');
        year.forEach(r => {
            periods = this.addReport(periods, r);
        });
        year = this.parseYear(workbook, 'K');
        year.forEach(r => {
            periods = this.addReport(periods, r);
        });

        let report = this.parseQuarter(workbook, 'C');
        periods = this.addReport(periods, report);
        report = this.parseQuarter(workbook, 'D');
        periods = this.addReport(periods, report);
        report = this.parseQuarter(workbook, 'E');
        periods = this.addReport(periods, report);
        report = this.parseQuarter(workbook, 'F');
        periods = this.addReport(periods, report);
        report = this.parseQuarter(workbook, 'G');
        periods = this.addReport(periods, report);
        report = this.parseQuarter(workbook, 'H');
        periods = this.addReport(periods, report);
        report = this.parseQuarter(workbook, 'I');
        periods = this.addReport(periods, report);
        report = this.parseQuarter(workbook, 'J');
        periods = this.addReport(periods, report);
        report = this.parseQuarter(workbook, 'K');
        periods = this.addReport(periods, report);
        report = this.parseQuarter(workbook, 'L');
        periods = this.addReport(periods, report);

        const reports: Reports = {
            id: this.generateId(workbook.Sheets.Info.C15.v),
            currency: workbook.Sheets.Info.C28 ? workbook.Sheets.Info.C28.v : null,
            periods: periods
        }
                
        return sortReports(reports);
    }

    public getDividends(workbook: XLSX.WorkBook): Dividends {
        let years: Dividend[] = [];

        let dividend = this.parseDividend(workbook, 'C');
        years = this.addDividend(years, dividend);
        dividend = this.parseDividend(workbook, 'D');
        years = this.addDividend(years, dividend);
        dividend = this.parseDividend(workbook, 'E');
        years = this.addDividend(years, dividend);
        dividend = this.parseDividend(workbook, 'F');
        years = this.addDividend(years, dividend);
        dividend = this.parseDividend(workbook, 'G');
        years = this.addDividend(years, dividend);
        dividend = this.parseDividend(workbook, 'H');
        years = this.addDividend(years, dividend);
        dividend = this.parseDividend(workbook, 'I');
        years = this.addDividend(years, dividend);
        dividend = this.parseDividend(workbook, 'J');
        years = this.addDividend(years, dividend);
        dividend = this.parseDividend(workbook, 'K');
        years = this.addDividend(years, dividend);

        const dividends: Dividends = {
            id: this.generateId(workbook.Sheets.Info.C15.v),
            years: years
        }
        
        return dividends;
    }
    
    private createPeriods(): Report[] {
        const date = new Date();
        const startYear = date.getUTCFullYear() - 10;
        const reports: Report[] = [];
        const report: Report = {
            period: null,
            startDate: null,
            endDate: null,
            revenue: null,
            netIncome: null,
            assets: null,
            equity: null,
            operatingCashflow: null,
            investingCashflow: null,
            financingCashflow: null,
            numberOfShares: null,
            stockPrice: null,
            type: 'p'
        };

        for(let year = startYear; year <= date.getUTCFullYear(); year++) {
            const q1 = { ...report };
            q1.period = year + ' Q1';
            q1.startDate = firestore.Timestamp.fromDate(new Date(year + '-01-01'));
            q1.endDate = firestore.Timestamp.fromDate(new Date(year + '-03-31'));
            if(q1.endDate.toMillis() < Date.now()) {
                reports.push(q1);
            }

            const q2 = { ...report };
            q2.period = year + ' Q2';
            q2.startDate = firestore.Timestamp.fromDate(new Date(year + '-04-01'));
            q2.endDate = firestore.Timestamp.fromDate(new Date(year + '-06-30'));
            if(q2.endDate.toMillis() < Date.now()) {
                reports.push(q2);
            }

            const q3 = { ...report };
            q3.period = year + ' Q3';
            q3.startDate = firestore.Timestamp.fromDate(new Date(year + '-07-01'));
            q3.endDate = firestore.Timestamp.fromDate(new Date(year + '-09-30'));
            if(q3.endDate.toMillis() < Date.now()) {
                reports.push(q3);
            }

            const q4 = { ...report };
            q4.period = year + ' Q4';
            q4.startDate = firestore.Timestamp.fromDate(new Date(year + '-10-01'));
            q4.endDate = firestore.Timestamp.fromDate(new Date(year + '-12-31'));
            if(q4.endDate.toMillis() < Date.now()) {
                reports.push(q4);
            }
        }

        return reports;
    }

    private generateId(name): string {
        return name
                .toLowerCase()
                .trim()
                .split(' ').join('-')
                .split('å').join('a')
                .split('ä').join('a')
                .split('ö').join('o')
                .split('.').join('-')
                .split(':').join('-');
    }

    private parseDividend(workbook: XLSX.WorkBook, column): Dividend {
        let year: string = workbook.Sheets.Year[column + '1'] ? workbook.Sheets.Year[column + '1'].v : null;
        if(year) {
            year = year.substring(year.length - 4, year.length);
        }       
        
        return {
            year,
            operatingCashflow: workbook.Sheets.Year[column + '40'] ? workbook.Sheets.Year[column + '40'].v : 0,
            freeCashflow: workbook.Sheets.Year[column + '41'] ? workbook.Sheets.Year[column + '41'].v : 0,
            dividend: workbook.Sheets.Year[column + '9'] ? workbook.Sheets.Year[column + '9'].v : 0,
        };
    }    

    private parseQuarter(workbook: XLSX.WorkBook, column): Report {
        if (!workbook.Sheets.Quarter[column + '1']) {
            return null;
        }
        const report: Report = {
            period: workbook.Sheets.Quarter[column + '1'] ? workbook.Sheets.Quarter[column + '1'].v : null,
            startDate: null,
            endDate: null,
            revenue: workbook.Sheets.Quarter[column + '2'] ? workbook.Sheets.Quarter[column + '2'].v : null,
            netIncome: workbook.Sheets.Quarter[column + '6'] ? workbook.Sheets.Quarter[column + '6'].v : null,
            assets: workbook.Sheets.Quarter[column + '17'] ? workbook.Sheets.Quarter[column + '17'].v : null,
            equity: workbook.Sheets.Quarter[column + '18'] ? workbook.Sheets.Quarter[column + '18'].v : null, 
            numberOfShares: workbook.Sheets.Quarter[column + '8'] ? Number.parseFloat(workbook.Sheets.Quarter[column + '8'].v) * 1000000 : null,
            operatingCashflow: workbook.Sheets.Quarter[column + '24'] ? workbook.Sheets.Quarter[column + '24'].v : null,
            investingCashflow: workbook.Sheets.Quarter[column + '25'] ? workbook.Sheets.Quarter[column + '25'].v / 4 : null,
            financingCashflow: workbook.Sheets.Quarter[column + '26'] ? workbook.Sheets.Quarter[column + '26'].v / 4 : null,
            stockPrice: null,
            type: 'q'
        };
        const quarter = report.period.substring(0, 2);
        const year = report.period.substring(3, 7);
        report.period = year + ' ' + quarter

        switch (quarter) {
            case 'Q1':
                report.startDate = firestore.Timestamp.fromDate(new Date(year + '-01-01'));
                report.endDate = firestore.Timestamp.fromDate(new Date(year + '-03-31'));
                break;
            case 'Q2':
                report.startDate = firestore.Timestamp.fromDate(new Date(year + '-04-01'));
                report.endDate = firestore.Timestamp.fromDate(new Date(year + '-06-30'));
                break;
            case 'Q3':
                report.startDate = firestore.Timestamp.fromDate(new Date(year + '-07-01'));
                report.endDate = firestore.Timestamp.fromDate(new Date(year + '-09-30'));
                break;
            case 'Q4':
                report.startDate = firestore.Timestamp.fromDate(new Date(year + '-10-01'));
                report.endDate = firestore.Timestamp.fromDate(new Date(year + '-12-31'));
                break;
        }

        return report;
    }

    private parseYear(workbook: XLSX.WorkBook, column): Report[] {
        const reports: Report[] = [];
        if (!workbook.Sheets.Year[column + '1']) {
            return reports;
        }
        let year: string = workbook.Sheets.Year[column + '1'].v;
        year = year.substring(year.length - 4, year.length);
        const q1: Report = {
            period: year + ' Q1',
            startDate: null,
            endDate: null,            
            revenue: workbook.Sheets.Year[column + '2'] ? workbook.Sheets.Year[column + '2'].v / 4 : null,
            netIncome: workbook.Sheets.Year[column + '6'] ? workbook.Sheets.Year[column + '6'].v / 4 : null,
            assets: workbook.Sheets.Year[column + '17'] ? workbook.Sheets.Year[column + '17'].v : null,
            equity: workbook.Sheets.Year[column + '18'] ? workbook.Sheets.Year[column + '18'].v : null,
            operatingCashflow: workbook.Sheets.Year[column + '24'] ? workbook.Sheets.Year[column + '24'].v / 4 : null,
            investingCashflow: workbook.Sheets.Year[column + '25'] ? workbook.Sheets.Year[column + '25'].v / 4 : null,
            financingCashflow: workbook.Sheets.Year[column + '26'] ? workbook.Sheets.Year[column + '26'].v / 4 : null,
            numberOfShares: workbook.Sheets.Year[column + '8'] ? Number.parseFloat(workbook.Sheets.Year[column + '8'].v) * 1000000 : null,
            stockPrice: null,
            type: 'y'
        };

        reports.push(q1);

        const q2 = { ...q1 };
        q2.period = year + ' Q2';
        reports.push(q2);

        const q3 = { ...q1 };
        q3.period = year + ' Q3';
        reports.push(q3);

        const q4 = { ...q1 };
        q4.period = year + ' Q4';
        reports.push(q4);

        reports.forEach(r => {
            switch (r.period.substring(5,7)) {
                case 'Q1':
                    r.startDate = firestore.Timestamp.fromDate(new Date(year + '-01-01'));
                    r.endDate = firestore.Timestamp.fromDate(new Date(year + '-03-31'));
                    break;
                case 'Q2':
                    r.startDate = firestore.Timestamp.fromDate(new Date(year + '-04-01'));
                    r.endDate = firestore.Timestamp.fromDate(new Date(year + '-06-30'));
                    break;
                case 'Q3':
                    r.startDate = firestore.Timestamp.fromDate(new Date(year + '-07-01'));
                    r.endDate = firestore.Timestamp.fromDate(new Date(year + '-09-30'));
                    break;
                case 'Q4':
                    r.startDate = firestore.Timestamp.fromDate(new Date(year + '-10-01'));
                    r.endDate = firestore.Timestamp.fromDate(new Date(year + '-12-31'));
                    break;
            }
        });

        return reports;
    }

    private addReport(reports: Report[], report: Report): Report[] {
        if (report) {
            reports = reports.filter(r => r.period !== report.period);
            reports.push(report);
        }

        return reports;
    }

    private addDividend(dividends: Dividend[], dividend: Dividend): Dividend[] {
        if (dividend && dividend.year) {
            dividends = dividends.filter(x => x.year !== dividend.year);
            dividends.push(dividend);
        }

        return dividends;
    }
}
