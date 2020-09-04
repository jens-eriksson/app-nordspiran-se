import { StockPricesProvider } from './../../data/stock-prices.provider';
import { ModalProvider } from './../../layout/modal.provider';
import { Router } from '@angular/router';
import { LayoutProvider } from './../../layout/layout.provider';
import { CompanyProvider } from './../../data/company.provider';
import { Component, OnInit } from '@angular/core';
import { Company } from '../../data/company';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-public-companies',
  templateUrl: './public-companies.component.html',
  styleUrls: ['./public-companies.component.scss']
})
export class PublicCompaniesComponent implements OnInit {
  companies: Company[];
  sortBy = 'investmentGrade';
  sortOrder = 'desc';
  subscpition: Subscription;

  constructor(
    private companyProvider: CompanyProvider,
    private stockPricesProvider: StockPricesProvider,
    private layout: LayoutProvider,
    private modal: ModalProvider,
    private router: Router
  ) {
    this.subscpition = this.companyProvider.all(this.sortBy, this.sortOrder).subscribe(companies => {
      this.companies = companies;
    });
  }

  ngOnInit() {
  }

  open(company: Company) {
    const path = '/companies/' + company.id;
    this.layout.registerPage({
      id: company.id,
      name: company.name,
      paths: [path],
      closeable: true
    });
    this.router.navigate([path]);
  }

  confirmDelete(company: Company) {
    this.modal.confirm('Delete ' + company.name + '?', () => {
      this.delete(company.id);
    });
  }

  delete(id) {
    this.companyProvider.delete(id);
    this.stockPricesProvider.delete(id);
  }

  sort(sortBy) {
    if (this.sortBy === sortBy) {
      if (this.sortOrder === 'asc') {
        this.sortOrder = 'desc';
      } else if (this.sortOrder === 'desc') {
        this.sortOrder = 'asc';
      }
    } else {
     this.sortOrder = 'asc';
    }
    this.sortBy = sortBy;
    this.subscpition.unsubscribe();
    this.subscpition = this.companyProvider.all(this.sortBy, this.sortOrder).subscribe(companies => {
      this.companies = companies;
    });
  }
}
