import { ListProvider } from './../../../data/list.provider';
import { Company } from './../../../../../shared/company';
import { CompanyProvider } from './../../../data/company.provider';
import { AuthProvider } from './../../../auth/auth.provider';
import { Component, OnInit } from '@angular/core';
import { List } from 'shared/list';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  data;
  list: List;
  list1: Company[] = [];
  list2: Company[] = [];
  selectedList1 = [];
  selectedList2 = [];
  
  constructor(
    private auth: AuthProvider, 
    private companyProvider: CompanyProvider,
    private listProvider: ListProvider
  ) {   
  }

  ngOnInit(): void {
    if (this.data) {
      this.list = { ...this.data};
    } else {
      this.list = {
        name: '',
        companies: [],
        uid: this.auth.uid()
      }
    }
    
    this.companyProvider.all().then(companies => {
      companies.forEach(company => {
        if (!this.list.companies.includes(company.id)) {
          this.list1.push(company);
        }
        else {
          this.list2.push(company);
        }
      });
    });
    
  }

  select() {
    this.selectedList1.forEach(id => {
      this.list2.push(this.list1.find(c => c.id === id));
      this.list2.sort(this.compare('name'));
      this.list1 = this.list1.filter(c => c.id !== id);
    });
    this.selectedList1 = [];
  }

  deselect() {
    this.selectedList2.forEach(id => {
      this.list1.push(this.list2.find(c => c.id === id));
      this.list1.sort(this.compare('name'));
      this.list2 = this.list2.filter(c => c.id !== id);
    });
    this.selectedList2 = [];
  }

  confirm2() {
    this.list.companies = [];
    this.list2.forEach(company => {
      this.list.companies.push(company.id);
    });
    this.listProvider.set(this.list).then(() => {
      this['confirm']();
    }).catch(err => {
      console.log(err);
    });
  }

  cancel() {
    this['cancel']();
  }

  private compare(property) {
    let sortOrder = 1;
    if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
    }
    return (a, b) => {
        const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
  }
}
