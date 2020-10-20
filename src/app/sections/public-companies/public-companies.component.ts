import { List } from './../../../../shared/list';
import { ListProvider } from './../../data/list.provider';
import { PageStateProvider } from './../../data/page-state.provider';
import { StockPricesProvider } from './../../data/stock-prices.provider';
import { ModalProvider } from './../../layout/modal.provider';
import { Router } from '@angular/router';
import { LayoutProvider } from './../../layout/layout.provider';
import { CompanyProvider } from './../../data/company.provider';
import { Component, OnInit } from '@angular/core';
import { Company } from '../../../../shared/company';
import { PageState } from 'shared/page-state';

@Component({
  selector: 'app-public-companies',
  templateUrl: './public-companies.component.html',
  styleUrls: ['./public-companies.component.scss']
})
export class PublicCompaniesComponent implements OnInit {
  companies: Company[];
  visableCompanies: Company[];
  list: List;
  lists: List[];
  pageState: PageState = {
    path: this.router.routerState.snapshot.url,
    view: {
      list: null,
      sortBy: '-investmentGrade'
    }
  };

  constructor(
    private companyProvider: CompanyProvider,
    private stockPricesProvider: StockPricesProvider,
    private layoutProvider: LayoutProvider,
    private pageStateProvider: PageStateProvider,
    private modal: ModalProvider,
    private router: Router,
    public listProvider: ListProvider
  ) {
    this.pageStateProvider.load().then(() => {
      const state = this.pageStateProvider.getByPath(this.pageState.path);
      if (state) {
        this.pageState = state;
      }
      this.listProvider.getByUser().subscribe(lists => {
        this.lists = lists;
      });
      this.listProvider.get(this.pageState.view.list).then(list => {
        this.list = list;
      });
      this.companyProvider.listener().subscribe(companies => {
        this.companies = companies;
      });
    });
  }

  ngOnInit() {
  }

  open(company: Company) {
    const path = '/companies/' + company.id;
    const tab = this.layoutProvider.newTab([path], company.name, true);
    this.layoutProvider.openTab(tab);
    this.router.navigate([path]);
  }

  confirmDelete(company: Company) {
    this.modal.confirm('Delete ' + company.name + '?', () => {
      this.delete(company.id);
    });
  }

  listChange(list: List) {
    this.list = list ? this.lists.find(l => l.id == list.id) : list; 
    this.pageState.view.list = this.list ? this.list.id : null;
    this.pageStateProvider.set(this.pageState).then(state => {
      this.pageState = state;
    });
  }

  delete(id) {
    this.companyProvider.delete(id);
    this.stockPricesProvider.delete(id);
  }

  sort(sortBy: string) {
    if (this.pageState.view.sortBy === sortBy) {
      if (this.pageState.view.sortBy.startsWith('-')) {
        this.pageState.view.sortBy = sortBy.substring(1, sortBy.length);
      } else {
        this.pageState.view.sortBy = '-' + sortBy;
      }
    } else {
      this.pageState.view.sortBy = sortBy;
    }
    this.pageStateProvider.set(this.pageState).then(state => {
      this.pageState = state;
    });
  }
}
