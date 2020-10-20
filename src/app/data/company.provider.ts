import { Injectable } from '@angular/core';
import { Company } from '../../../shared/company';
import { DataProvider } from './data.provider';

@Injectable()
export class CompanyProvider extends DataProvider<Company>{

  constructor() {
    super('companies');
  }

  public async set(company: Company): Promise<Company> {
    company.reports.sort(this.reportComparer);
    return super.set(company);
  }

  private reportComparer(a, b) {
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
}
