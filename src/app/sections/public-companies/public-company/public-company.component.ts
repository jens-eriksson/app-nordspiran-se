import { CompanyProvider } from './../../../data/company.provider';
import { Company } from './../../../../../shared/company';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-public-company',
  templateUrl: './public-company.component.html',
  styleUrls: ['./public-company.component.scss']
})
export class PublicCompanyComponent implements OnInit {
  companies: Company[];
  selected: Company;

  constructor(private router: Router, private route: ActivatedRoute, private companyProvider: CompanyProvider) {
  }

  ngOnInit() {
    this.companyProvider.listener().subscribe(companies => {
      this.companies = companies;
      this.selected = this.companies.find(c => c.id === this.route.snapshot.params.id);
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.selected = this.companies.find(c => c.id === this.route.snapshot.params.id);
      }
    });
  }
}
