import { Dividend } from './dividend';
import { Report } from './report';
import { PriceDay } from './stock-prices';
import { firestore } from 'firebase';

export interface Company {
    id: string;
    borsdataId: number;
    name: string;
    ticker: string;
    stockPriceCurrency: string;
    reportCurrency: string;
    revenueTTM?: number;
    netIncomeTTM?: number;
    profitMarginTTM?: number;
    operatingCashflowTTM?: number;
    freeCashflowTTM?: number;
    freeCashflowMargin?: number;
    lastDividend?: number;
    assets?: number;
    equity?: number;
    peCurrent?: number;
    marketCap?: number;
    solidity?: number;
    numberOfShares?: number;
    stockPrice?: number;
    roa?: number;
    roe?: number;
    investmentGrade?: number;
    updated?: firestore.Timestamp;
    fiscalYearEnd?: number;
}

export function calculate(company: Company, latestReport: Report, priceDay: PriceDay, lastDividend:Dividend): Company {
    company.revenueTTM = latestReport.revenueTTM;
    company.netIncomeTTM = latestReport.netIncomeTTM;
    company.profitMarginTTM = latestReport.profitMarginTTM;
    company.assets = latestReport.assets;
    company.equity = latestReport.equity;
    company.solidity = latestReport.solidity;
    company.operatingCashflowTTM = latestReport.operatingCashflowTTM;
    company.freeCashflowTTM = latestReport.freeCashflowTTM;
    company.freeCashflowMargin = latestReport.freeCashflowMargin;
    company.marketCap = latestReport.numberOfShares * priceDay.stockPrice / 1000000;
    company.stockPrice = priceDay.stockPrice;
    company.peCurrent = company.marketCap / company.netIncomeTTM;
    company.lastDividend = lastDividend.dividend;
    company.roa = latestReport.roa;
    company.roe = latestReport.roe;
    company.investmentGrade = 1 / company.peCurrent * company.roa * 10000;
    if (company.peCurrent < 0 && company.investmentGrade > 0) {
        company.investmentGrade = -1 * company.investmentGrade;
    }
    if (company.roa < 0 && company.investmentGrade > 0) {
        company.investmentGrade = -1 * company.investmentGrade;
    }

    return company;    
}

export function merge(target: Company, source: Company): Company {
    if(!target) {
        return source;
    }
       
    if(!source || target.id !== source.id) {
        return target;
    }
    let fiscalYearEnd = target.fiscalYearEnd;
    target = { ...source };
    target.fiscalYearEnd = fiscalYearEnd;

    return target;
}
