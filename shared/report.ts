import { firestore } from 'firebase';

export interface Reports {
    id: string;
    currency: string;
    periods: Report[];
}

export interface Report {
    period: string;
    startDate: firestore.Timestamp;
    endDate: firestore.Timestamp;
    revenue: number;
    netIncome: number;
    assets: number;
    equity: number;
    operatingCashflow: number;
    investingCashflow: number;
    financingCashflow: number;
    numberOfShares: number;
    stockPrice: number;
    marketCap?: number;
    netCashflow?: number;
    freeCashflow?: number;
    revenueTTM?: number;
    netIncomeTTM?: number;
    profitMarginTTM?: number;
    freeCashflowMarginTTM?: number;
    operatingCashflowTTM?: number;
    investingCashflowTTM?: number;
    financingCashflowTTM?: number;
    freeCashflowTTM?: number;
    netCashflowTTM?: number;
    peTTM?: number;
    profitMargin?: number;
    freeCashflowMargin?: number;
    solidity?: number;
    roa?: number;
    roe?: number;
    type?: string;
}

export function isReady(report: Report): boolean {
    if(!report){
        return false;
    }

    if(report.revenue || report.revenue === 0 &&
       report.netIncome || report.netIncome === 0  &&
       report.assets || report.assets === 0  &&
       report.equity || report.equity === 0  &&
       report.numberOfShares || report.numberOfShares === 0  &&
       report.operatingCashflow || report.operatingCashflow === 0  &&
       report.investingCashflow || report.investingCashflow === 0  &&
       report.financingCashflow || report.financingCashflow === 0  &&
       report.stockPrice || report.stockPrice === 0 ) {
        return true;
    }

    return false;
}

export function getTTMReports(r4: Report, all: Report[], onlyReady?: boolean): Report[] {
    let year = Number.parseInt(r4.period.substring(0, 4));
    const quarter = r4.period.substring(5, 7);
    let r1Period;
    let r2Period;
    let r3Period;
    switch(quarter) {
        case "Q1":
            year--;
            r3Period = year + " Q4";
            r2Period = year + " Q3";
            r1Period = year + " Q2";               
            break;
        case "Q2":
            r3Period = year + " Q1";
            year--;
            r2Period = year + " Q4";
            r1Period = year + " Q3";
            break;
        case "Q3":
            r3Period = year + " Q2";
            r2Period = year + " Q1";
            year--;
            r1Period = year + " Q4";
            break;
        case "Q4":
            r3Period = year + " Q3";
            r2Period = year + " Q2";
            r1Period = year + " Q1";
            break;
    }

    const reports: Report[] = [];
    if(onlyReady) {
        if(isReady(r4)) {
            reports.push(r4);
        }       
    
        const r3 = all.find(r => r.period === r3Period);
        if(isReady(r3)) {
            reports.push(r3);
        }
    
        const r2 = all.find(r => r.period === r2Period);
        if(isReady(r2)) {
            reports.push(r2);
        }
    
        const r1 = all.find(r => r.period === r1Period);
        if(isReady(r1)) {
            reports.push(r1);
        }
    } else {
        if(r4) {
            reports.push(r4);
        }       
    
        const r3 = all.find(r => r.period === r3Period);
        if(r3) {
            reports.push(r3);
        }
    
        const r2 = all.find(r => r.period === r2Period);
        if(r2) {
            reports.push(r2);
        }
    
        const r1 = all.find(r => r.period === r1Period);
        if(1) {
            reports.push(r1);
        }
    }
    

    return reports;
}

export function calculate(report: Report, ttms: Report[]): Report {
    if(isReady(report)) {
        // Valuation
        report.marketCap = report.stockPrice * report.numberOfShares / 1000000;    

        // Period
        report.profitMargin = report.netIncome / report.revenue;
        report.solidity = report.equity / report.assets;
        report.freeCashflow = report.operatingCashflow + report.investingCashflow;
        report.netCashflow = report.operatingCashflow + report.investingCashflow + report.financingCashflow;
        report.freeCashflowMargin = report.freeCashflow / report.revenue;

        // TTM
        if(ttms.length === 4) {
            report.revenueTTM = 0;
            report.netIncomeTTM = 0;
            report.operatingCashflowTTM = 0;
            report.investingCashflowTTM = 0;
            report.financingCashflowTTM = 0;

            ttms.forEach(ttm => {
                report.revenueTTM += ttm.revenue;
                report.netIncomeTTM += ttm.netIncome;
                report.operatingCashflowTTM += ttm.operatingCashflow;
                report.investingCashflowTTM += ttm.investingCashflow;
                report.financingCashflowTTM += ttm.financingCashflow;
            });

            report.profitMarginTTM = report.netIncomeTTM / report.revenueTTM;
            report.freeCashflowTTM = report.operatingCashflowTTM + report.investingCashflowTTM;
            report.netCashflowTTM = report.operatingCashflowTTM + report.investingCashflowTTM + report.financingCashflowTTM;
            report.freeCashflowMarginTTM = report.freeCashflowTTM / report.revenueTTM;

            report.peTTM = report.marketCap / report.netIncomeTTM;
            report.roa = report.netIncomeTTM / report.assets;
            report.roe = report.netIncomeTTM / report.equity;
        }
    } 
    return report;
}

export function merge(target: Reports, source: Reports): Reports {
    if(!target) {
        return sort(source);
    }

    if(target.id !== source.id) {
        return sort(target);
    }

    source.periods.forEach(rs => {
        const rt = target.periods.find(rt => rt.period === rs.period);
        if(rt) {
            if(rs.type === 'q'){
                target.periods = target.periods.filter(r => r.period != rs.period);
                target.periods.push(rs);
            }
            if(rs.type === 'y' && rt.type === 'y') {
                target.periods = target.periods.filter(r => r.period != rs.period);
                target.periods.push(rs);
            }
        } else {
            target.periods.push(rs);
        }
    });

    return sort(target);
}

export function sort(reports: Reports): Reports {
    function reportComparer(a, b) {
        const periodA = a.period.toUpperCase();
        const periodB = b.period.toUpperCase();

        let comparison = 0;
        if (periodA > periodB) {
            comparison = -1;
        } else if (periodA < periodB) {
            comparison = 1;
        }
        return comparison;
    }

    reports.periods.sort(reportComparer);
    
    return reports;
}

export function getReportByDate(reports: Reports, date: firestore.Timestamp): Report {
    let report = reports.periods.find(r => r.startDate.seconds <= date.seconds && r.endDate.seconds >= date.seconds);
    if(!report) {
        const lastReport = reports.periods[0];
        if(lastReport && lastReport.endDate.seconds < date.seconds) {
            report = lastReport;
        }
    }
    
    return report;
}

export function getLatestReport(reports: Reports): Report {
    for(const report of reports.periods) {
        if(isReady(report)) {
            return report;
        }
    }
    return null;
}

export function convertPeriod(report: Report, fiscalYearEnd?: number): Report {
    if(!fiscalYearEnd) {
        fiscalYearEnd = 12;
    }
    const quarter = report.period.substring(5, 7);
    let year = Number.parseInt(report.period.substring(0, 4));

    switch(fiscalYearEnd) {
        case 9:
            switch(quarter) {
                case "Q1":
                    year--;
                    report.period = year + ' ' + 'Q4';
                    break;
                case "Q2":
                    report.period = year + ' ' + 'Q1';
                    break;
                case "Q3":
                    report.period = year + ' ' + 'Q2';
                    break;
                case "Q4":
                    report.period = year + ' ' + 'Q3';
                    break;
            }
            break;
        case 6:
            switch(quarter) {
                case "Q1":
                    year--;
                    report.period = year + ' ' + 'Q3';
                    break;
                case "Q2":
                    year--;
                    report.period = year + ' ' + 'Q4';
                    break;
                case "Q3":
                    report.period = year + ' ' + 'Q1';
                    break;
                case "Q4":
                    report.period = year + ' ' + 'Q2';
                    break;
            }
            break;
        case 3:
            switch(quarter) {
                case "Q1":
                    year--;
                    report.period = year + ' ' + 'Q2';
                    break;
                case "Q2":
                    year--;
                    report.period = year + ' ' + 'Q3';
                    break;
                case "Q3":
                    year--;
                    report.period = year + ' ' + 'Q4';
                    break;
                case "Q4":
                    report.period = year + ' ' + 'Q1';
                    break;
            }
            break;
    }

    switch (report.period.substring(5,7)) {
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
