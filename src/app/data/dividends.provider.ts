import { Dividends } from './../../../shared/dividend';
import { DataProvider } from './data.provider';
import { Injectable } from '@angular/core';

@Injectable()
export class DividensProvider extends DataProvider<Dividends> {
  constructor() {
    super('dividends');
  }
}
