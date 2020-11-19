import { Injectable } from '@angular/core';
import { Company } from '../../../shared/company';
import { DataProvider } from './data.provider';

@Injectable()
export class CompanyProvider extends DataProvider<Company>{
  constructor() {
    super('companies');
  }
}
