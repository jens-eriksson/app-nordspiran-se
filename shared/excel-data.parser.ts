import { Report } from './report';
import { Company } from './company';
import * as XLSX from 'xlsx';
import { StockPrices } from './stock-prices';

export class ExcelDataParser {
    getCompany(workbook: XLSX.WorkBook): Company {
        const company: Company = {
            id: this.generateId(workbook.Sheets.Info.C15.v),
            borsdataId: workbook.Sheets.Info.C18 ? workbook.Sheets.Info.C18.v : null,
            name: workbook.Sheets.Info.C15 ? workbook.Sheets.Info.C15.v : null,
            ticker: workbook.Sheets.Info.C16 ? workbook.Sheets.Info.C16.v : null,
            reports: [],
            dividend: [],
            updated: workbook.Sheets.Info.C14 ? new Date(workbook.Sheets.Info.C14.w) : null,
            revenueTTM: workbook.Sheets.R12.L2 ? workbook.Sheets.R12.L2.v : null,
            netIncomeTTM: workbook.Sheets.R12.L6 ? workbook.Sheets.R12.L6.v : null,
            profitMarginTTM: workbook.Sheets.R12.L47 ? workbook.Sheets.R12.L47.v / 100 : null,
            operatingCashflowTTM: workbook.Sheets.R12.L24 ? workbook.Sheets.R12.L24.v : null,
            freeCashflowTTM: workbook.Sheets.R12.L28 ? workbook.Sheets.R12.L28.v : null,
            freeCashflowMargin: workbook.Sheets.R12.L57 ? workbook.Sheets.R12.L57.v / 100 : null,
            assets: workbook.Sheets.R12.L17 ? workbook.Sheets.R12.L17.v : null,
            equity: workbook.Sheets.R12.L18 ? workbook.Sheets.R12.L18.v : null,
            roe: workbook.Sheets.R12.L52 ? workbook.Sheets.R12.L52.v / 100 : null,
            roa: workbook.Sheets.R12.L53 ? workbook.Sheets.R12.L53.v / 100 : null,
            numberOfShares: workbook.Sheets.R12.L8 ? Number.parseFloat(workbook.Sheets.R12.L8.v) * 1000000 : null,
            stockPriceCurrency: workbook.Sheets.Info.C27 ? workbook.Sheets.Info.C27.v : null,
            reportCurrency: workbook.Sheets.Info.C28 ? workbook.Sheets.Info.C28.v : null,
            lastDividend: workbook.Sheets.Year.K9 ? workbook.Sheets.Year.K9.v : null,
            peCurrent: null,
            marketCap: null,
            solidity: null,
            stockPrice: null,
            investmentGrade: null
        };

        const stockPrices = this.getStockPrices(workbook);
        stockPrices.days[0]  ? company.marketCap = +(company.numberOfShares * stockPrices.days[0].price / 1000000)
                        : company.marketCap = 0;

        company.peCurrent = company.marketCap / company.netIncomeTTM;
        company.investmentGrade = 1 / company.peCurrent * company.roa * 10000;
        if (company.peCurrent < 0 && company.investmentGrade > 0) {
            company.investmentGrade = -1 * company.investmentGrade;
        }
        if (company.roa < 0 && company.investmentGrade > 0) {
            company.investmentGrade = -1 * company.investmentGrade;
        }
        company.solidity = company.equity / company.assets;
        company.stockPrice = stockPrices.days[0].price;

        let dividend = this.getDividend(workbook.Sheets.Year, 'C');
        if (dividend.year) {
            company.dividend.push(dividend);
        }
        dividend = this.getDividend(workbook.Sheets.Year, 'D');
        if (dividend.year) {
            company.dividend.push(dividend);
        }
        dividend = this.getDividend(workbook.Sheets.Year, 'E');
        if (dividend.year) {
            company.dividend.push(dividend);
        }
        dividend = this.getDividend(workbook.Sheets.Year, 'F');
        if (dividend.year) {
            company.dividend.push(dividend);
        }
        dividend = this.getDividend(workbook.Sheets.Year, 'G');
        if (dividend.year) {
            company.dividend.push(dividend);
        }
        dividend = this.getDividend(workbook.Sheets.Year, 'H');
        if (dividend.year) {
            company.dividend.push(dividend);
        }
        dividend = this.getDividend(workbook.Sheets.Year, 'I');
        if (dividend.year) {
            company.dividend.push(dividend);
        }
        dividend = this.getDividend(workbook.Sheets.Year, 'J');
        if (dividend.year) {
            company.dividend.push(dividend);
        }
        dividend = this.getDividend(workbook.Sheets.Year, 'K');
        if (dividend.year) {
            company.dividend.push(dividend);
        }

        let reports = this.parseYear(workbook.Sheets.Year, 'C', stockPrices);
        reports.forEach(r => this.addReport(company, r));
        reports = this.parseYear(workbook.Sheets.Year, 'D', stockPrices);
        reports.forEach(r => this.addReport(company, r));
        reports = this.parseYear(workbook.Sheets.Year, 'E', stockPrices);
        reports.forEach(r => this.addReport(company, r));
        reports = this.parseYear(workbook.Sheets.Year, 'F', stockPrices);
        reports.forEach(r => this.addReport(company, r));
        reports = this.parseYear(workbook.Sheets.Year, 'G', stockPrices);
        reports.forEach(r => this.addReport(company, r));
        reports = this.parseYear(workbook.Sheets.Year, 'H', stockPrices);
        reports.forEach(r => this.addReport(company, r));
        reports = this.parseYear(workbook.Sheets.Year, 'I', stockPrices);
        reports.forEach(r => this.addReport(company, r));
        reports = this.parseYear(workbook.Sheets.Year, 'J', stockPrices);
        reports.forEach(r => this.addReport(company, r));
        reports = this.parseYear(workbook.Sheets.Year, 'K', stockPrices);
        reports.forEach(r => this.addReport(company, r));

        let report = this.parseQuarter(workbook, 'C', stockPrices);
        this.addReport(company, report);
        report = this.parseQuarter(workbook, 'D', stockPrices);
        this.addReport(company, report);
        report = this.parseQuarter(workbook, 'E', stockPrices);
        this.addReport(company, report);
        report = this.parseQuarter(workbook, 'F', stockPrices);
        this.addReport(company, report);
        report = this.parseQuarter(workbook, 'G', stockPrices);
        this.addReport(company, report);
        report = this.parseQuarter(workbook, 'H', stockPrices);
        this.addReport(company, report);
        report = this.parseQuarter(workbook, 'I', stockPrices);
        this.addReport(company, report);
        report = this.parseQuarter(workbook, 'J', stockPrices);
        this.addReport(company, report);
        report = this.parseQuarter(workbook, 'K', stockPrices);
        this.addReport(company, report);
        report = this.parseQuarter(workbook, 'L', stockPrices);
        this.addReport(company, report);

        return company;
    }

    getStockPrices(workbook: XLSX.WorkBook): StockPrices {
        const stockPrices: StockPrices = {
            id: this.generateId(workbook.Sheets.Info.C15.v),
            days: []
        };
        const cells = [];
        for (const cell in workbook.Sheets.PriceDay) {
            if (cell.startsWith('A') && cell !== 'A1') {
                cells.push(cell);
                const day = {
                    date: new Date(workbook.Sheets.PriceDay[cell].v),
                    price: workbook.Sheets.PriceDay[cell.replace('A', 'E')].v
                };
                stockPrices.days.push(day);
            }
        }

        return stockPrices;
    }

    private getDividend(sheet, column) {
        return {
            year: sheet[column + '1'] ? sheet[column + '1'].v : null,
            operatingCashflow: sheet[column + '40'] ? sheet[column + '40'].v : 0,
            freeCashflow: sheet[column + '41'] ? sheet[column + '41'].v : 0,
            dividend: sheet[column + '9'] ? sheet[column + '9'].v : 0,
        };
    }

    private generateId(name): string {
        return name
                .toLowerCase()
                .trim()
                .split(' ').join('-')
                .split('å').join('a')
                .split('ä').join('a')
                .split('ö').join('o')
                .split(':').join('-');
    }

    private parseYear(sheet, column, stockPrices: StockPrices): Report[] {
        const reports: Report[] = [];
        if (!sheet[column + '1']) {
            return reports;
        }
        let year: string = sheet[column + '1'].v;
        year = year.substring(year.length - 4, year.length);
        const q1: Report = {
            period: year + ' Q1',
            endDate: new Date(year + '-03-31'),
            marketCap: null,
            revenue: sheet[column + '2'] ? sheet[column + '2'].v / 4 : null,
            netIncome: sheet[column + '6'] ? sheet[column + '6'].v / 4 : null,
            profitMargin: sheet[column + '47'] ? sheet[column + '47'].v / 100 : null,
            assets: sheet[column + '17'] ? sheet[column + '17'].v : null,
            equity: sheet[column + '18'] ? sheet[column + '18'].v : null,
            numberOfShares: sheet[column + '8'] ? Number.parseFloat(sheet[column + '8'].v) * 1000000 : null,
            revenueTTM: sheet[column + '2'] ? sheet[column + '2'].v : null,
            netIncomeTTM: sheet[column + '6'] ? sheet[column + '6'].v : null,
            profitMarginTTM: sheet[column + '47'] ? sheet[column + '47'].v / 100 : null,
            operatingCashflow: sheet[column + '24'] ? sheet[column + '24'].v / 4 : null,
            freeCashflow: sheet[column + '28'] ? sheet[column + '28'].v / 4 : null,
            netCashflow: sheet[column + '27'] ? sheet[column + '27'].v / 4 : null,
            operatingCashflowTTM: sheet[column + '24'] ? sheet[column + '24'].v : null,
            freeCashflowTTM: sheet[column + '28'] ? sheet[column + '28'].v : null,
            netCashflowTTM: sheet[column + '27'] ? sheet[column + '27'].v : null,
            roe: sheet[column + '52'] ? sheet[column + '52'].v / 100 : null,
            roa: sheet[column + '53'] ? sheet[column + '53'].v / 100 : null,
            peTTM: null,
            solidity: null,
            type: 'y',
            stockPrice: null
        };

        let stockPrice = this.getStockPrice(q1.endDate, stockPrices);
        stockPrice ? q1.marketCap = +((q1.numberOfShares * stockPrice.price / 1000000).toFixed(3)) : q1.marketCap = 0;
        stockPrice ? q1.stockPrice = stockPrice.price : q1.stockPrice = 0;
        q1.peTTM = q1.marketCap / q1.netIncomeTTM;
        q1.solidity = q1.equity / q1.assets;
        reports.push(q1);

        const q2 = { ...q1 };
        q2.period = year + ' Q2';
        q2.endDate = new Date(year + '-06-30');
        stockPrice = this.getStockPrice(q2.endDate, stockPrices);
        stockPrice ? q2.marketCap = +((q2.numberOfShares * stockPrice.price / 1000000).toFixed(3)) : q2.marketCap = 0;
        stockPrice ? q2.stockPrice = stockPrice.price : q2.stockPrice = 0;
        q2.peTTM = q2.marketCap / q2.netIncomeTTM;
        q2.solidity = q2.equity / q2.assets;
        reports.push(q2);

        const q3 = { ...q1 };
        q3.period = year + ' Q3';
        q3.endDate = new Date(year + '-09-30');
        stockPrice = this.getStockPrice(q3.endDate, stockPrices);
        stockPrice ? q3.marketCap = +((q3.numberOfShares * stockPrice.price / 1000000).toFixed(3)) : q3.marketCap = 0;
        stockPrice ? q3.stockPrice = stockPrice.price : q3.stockPrice = 0;
        q3.peTTM = q3.marketCap / q3.netIncomeTTM;
        q3.solidity = q3.equity / q3.assets;
        reports.push(q3);

        const q4 = { ...q1 };
        q4.period = year + ' Q4';
        q4.endDate = new Date(year + '-12-31');
        stockPrice = this.getStockPrice(q4.endDate, stockPrices);
        stockPrice ? q4.marketCap = +((q4.numberOfShares * stockPrice.price / 1000000).toFixed(3)) : q4.marketCap = 0;
        stockPrice ? q4.stockPrice = stockPrice.price : q4.stockPrice = 0;
        q4.peTTM = q4.marketCap / q4.netIncomeTTM;
        q4.solidity = q4.equity / q4.assets;
        reports.push(q4);

        return reports;
    }

    private parseQuarter(workbook, column, stockPrices: StockPrices): Report {
        if (!workbook.Sheets.Quarter[column + '1']) {
            return null;
        }
        const report: Report = {
            period: workbook.Sheets.Quarter[column + '1'] ? workbook.Sheets.Quarter[column + '1'].v : null,
            endDate: null,
            marketCap: null,
            revenue: workbook.Sheets.Quarter[column + '2'] ? workbook.Sheets.Quarter[column + '2'].v : null,
            netIncome: workbook.Sheets.Quarter[column + '6'] ? workbook.Sheets.Quarter[column + '6'].v : null,
            profitMargin: workbook.Sheets.Quarter[column + '47'] ? workbook.Sheets.Quarter[column + '47'].v / 100 : null,
            assets: workbook.Sheets.Quarter[column + '17'] ? workbook.Sheets.Quarter[column + '17'].v : null,
            equity: workbook.Sheets.Quarter[column + '18'] ? workbook.Sheets.Quarter[column + '18'].v : null, 
            numberOfShares: workbook.Sheets.Quarter[column + '8'] ? Number.parseFloat(workbook.Sheets.Quarter[column + '8'].v) * 1000000 : null,
            revenueTTM: workbook.Sheets.R12[column + '2'] ? workbook.Sheets.R12[column + '2'].v : null,
            netIncomeTTM: workbook.Sheets.R12[column + '6'] ? workbook.Sheets.R12[column + '6'].v : null,
            profitMarginTTM: workbook.Sheets.R12[column + '47'] ? workbook.Sheets.R12[column + '47'].v / 100 : null,
            operatingCashflow: workbook.Sheets.Quarter[column + '24'] ? workbook.Sheets.Quarter[column + '24'].v : null,
            freeCashflow: workbook.Sheets.Quarter[column + '28'] ? workbook.Sheets.Quarter[column + '28'].v : null,
            netCashflow: workbook.Sheets.Quarter[column + '27'] ? workbook.Sheets.Quarter[column + '27'].v : null,
            operatingCashflowTTM: workbook.Sheets.R12[column + '24'] ? workbook.Sheets.R12[column + '24'].v : null,
            freeCashflowTTM: workbook.Sheets.R12[column + '28'] ? workbook.Sheets.R12[column + '28'].v : null,
            netCashflowTTM: workbook.Sheets.R12[column + '27'] ? workbook.Sheets.R12[column + '27'].v : null,
            roe: workbook.Sheets.R12[column + '52'] ? workbook.Sheets.R12[column + '52'].v / 100 : null,
            roa: workbook.Sheets.R12[column + '53'] ? workbook.Sheets.R12[column + '53'].v / 100: null,
            peTTM: null,
            solidity: null,
            type: 'q',
            stockPrice: null
        };
        const quarter = report.period.substring(0, 2);
        const year = report.period.substring(3, 7);
        report.period = year + ' ' + quarter;

        switch (quarter) {
            case 'Q1':
                report.endDate = new Date(year + '-03-31');
                break;
            case 'Q2':
                report.endDate = new Date(year + '-06-30');
                break;
            case 'Q3':
                report.endDate = new Date(year + '-09-30');
                break;
            case 'Q4':
                report.endDate = new Date(year + '-12-31');
                break;
        }

        const stockPrice = this.getStockPrice(report.endDate, stockPrices);
        stockPrice ? report.marketCap = +((report.numberOfShares * stockPrice.price / 1000000).toFixed(3)) : report.marketCap = 0;
        stockPrice ? report.stockPrice = stockPrice.price : report.stockPrice = 0;
        report.peTTM = report.marketCap / report.netIncomeTTM;
        report.solidity = report.equity / report.assets;
        return report;
    }

    private getStockPrice(date: Date, stockPrices: StockPrices) {
        date = new Date(date);
        let day = stockPrices.days.find(d => d.date.toDateString() === date.toDateString());
        let dayNum = date.getDate();

        while (!day && dayNum > 0) {
            dayNum = date.getDate() - 1;
            date.setDate(dayNum);
            day = stockPrices.days.find(d => d.date.toDateString() === date.toDateString());
        }

        return day;
    }

    private addReport(company, report) {
        if (report) {
            company.reports = company.reports.filter(r => r.period !== report.period);
            company.reports.push(report);
        }
    }
}
