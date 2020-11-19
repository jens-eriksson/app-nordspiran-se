import { Reports } from './../../../shared/report';
import { DataProvider } from './data.provider';
import { Injectable } from '@angular/core';

@Injectable()
export class ReportsProvider extends DataProvider<Reports> {
  constructor() {
    super('reports');
  }
}
