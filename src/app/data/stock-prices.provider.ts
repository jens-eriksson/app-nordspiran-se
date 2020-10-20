import { DataProvider } from './data.provider';
import { StockPrices } from './../../../shared/stock-prices';
import { Injectable } from '@angular/core';

@Injectable()
export class StockPricesProvider extends DataProvider<StockPrices> {
  constructor() {
    super('stock-prices');
  }
}
