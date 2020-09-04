import { Report } from './report';

export interface Company {
    id: string;
    borsdataId: number;
    name: string;
    ticker: string;
    reports: Report[];
    dividend: {
        year: string;
        operatingCashflow: number;
        freeCashflow: number;
        dividend: number;
    }[];
    updated: any;
    revenueTTM: number;
    netIncomeTTM: number;
    profitMarginTTM: number;
    operatingCashflowTTM: number;
    freeCashflowTTM: number;
    freeCashflowMargin: number;
    lastDividend: number;
    assets: number;
    equity: number;
    peCurrent: number;
    marketCap: number;
    solidity: number;
    numberOfShares: number;
    stockPrice: number;
    stockPriceCurrency: string;
    reportCurrency: string;
    roa: number;
    roe: number;
    investmentGrade: number;
}

