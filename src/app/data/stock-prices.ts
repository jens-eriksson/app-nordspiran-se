export interface StockPrices {
    id: string;
    days: {
        date: Date,
        price: number
    }[];
}
