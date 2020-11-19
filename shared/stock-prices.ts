import { Report } from 'shared/report';
import { firestore } from 'firebase';

export interface StockPrices {
    id: string;
    currency: string;
    days: PriceDay[];
}

export interface PriceDay {
    date: firestore.Timestamp;
    stockPrice: number;
    marketCap?: number;
    pe?: number;
}

export function calculate(priceDay: PriceDay, report: Report): PriceDay {
    if (report) {
        priceDay.marketCap = priceDay.stockPrice * report.numberOfShares / 1000000;
        priceDay.pe = priceDay.marketCap / report.netIncomeTTM;
    }

    return priceDay;
}

export function merge(target: StockPrices, source: StockPrices): StockPrices {
    if(!target) {
        return sort(source);
    }

    if(target.id !== source.id) {
        return sort(target);
    }

    source.days.forEach(ds => {
        const dt = target.days.find(dt => dt.date.seconds === ds.date.seconds);
        if(!dt) {
            target.days.push(ds);
        }
    });

    return sort(target);
}

export function sort(stockPrices: StockPrices): StockPrices {
    function priceDayComparer(a: PriceDay, b: PriceDay) {
        let comparison = 0;
        if (a.date.nanoseconds > b.date.nanoseconds) {
            comparison = -1;
        } else if (a.date.nanoseconds < b.date.nanoseconds) {
            comparison = 1;
        }
        return comparison;
    }

    stockPrices.days.sort(priceDayComparer);
    
    return stockPrices;
}

export function getPriceByDate(stockPrices: StockPrices, date: firestore.Timestamp): PriceDay {
    let go = true;;
    let day: PriceDay = null;
    const firstDay = stockPrices.days[stockPrices.days.length-1];
    const lastDay = stockPrices.days[0];
    while(go) {
        if(firstDay.date.seconds > date.seconds || lastDay.date.seconds < date.seconds) {
            break;
        }
        day = stockPrices.days.find(d => d.date.valueOf() === date.valueOf());
        if(day) {
            go = false;
        } else {
            const yesterday = date.toDate();
            yesterday.setSeconds(yesterday.getSeconds() - (24*60*60));
            date = firestore.Timestamp.fromDate(yesterday);
        }
    }
    return day;
}
