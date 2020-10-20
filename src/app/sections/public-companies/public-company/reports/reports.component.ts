import { Company } from './../../../../../../shared/company';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  @Input() company: Company;

  constructor() { }

  ngOnInit(): void {
  }

}
