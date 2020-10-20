import { Company } from './../../../../../../shared/company';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Input() company: Company;

  constructor() { }

  ngOnInit(): void {
  }

}
