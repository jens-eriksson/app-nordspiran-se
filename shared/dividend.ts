export interface Dividends {
    id: string;
    years: Dividend[];
}

export interface Dividend {
    year: string;
    operatingCashflow: number;
    freeCashflow: number;
    dividend: number;
}

export function merge(target: Dividends, source: Dividends): Dividends {
    if(!target) {
        return sort(source);
    }
       
    if(target.id !== source.id) {
        return sort(target);
    }

    source.years.forEach(ds => {
        const dt = target.years.find(dt => ds.year === dt.year);
        if(!dt) {
            target.years.push(ds);
        }
    });

    return sort(target);
}

export function sort(dividends: Dividends): Dividends {
    function dividendComparer(a, b) {
        if(a.year < b.year) { return 1; }
        if(a.year > b.year) { return -1; }
        return 0;
    }

    dividends.years.sort(dividendComparer);
    
    return dividends;
}