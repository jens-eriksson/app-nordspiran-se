export interface Report {
    period: string;
    endDate: Date;
    revenue: number;
    netIncome: number;
    profitMargin: number;
    assets: number;
    equity: number;
    numberOfShares: number;
    marketCap: number;
    stockPrice: number;
    revenueTTM: number;
    netIncomeTTM: number;
    profitMarginTTM: number;
    operatingCashflow: number;
    freeCashflow: number;
    netCashflow: number;
    operatingCashflowTTM: number;
    freeCashflowTTM: number;
    netCashflowTTM: number;
    peTTM: any;
    solidity: any;
    type: string;
    roa: number;
    roe: number;
}
