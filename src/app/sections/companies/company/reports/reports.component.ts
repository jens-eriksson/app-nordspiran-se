import { Company } from './../../../../../../shared/company';
import { EditReportsComponent } from './edit-reports/edit-reports.component';
import { ModalProvider } from './../../../../layout/modal.provider';
import { Reports, Report, isReady } from './../../../../../../shared/report';
import { Component, OnInit, Input } from '@angular/core';
import { StockPrices } from 'shared/stock-prices';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  @Input() company: Company;
  @Input() reports: Reports;
  @Input() stockPrices: StockPrices;

  constructor(private modalProvider: ModalProvider) { }

  ngOnInit(): void {
  }

  edit(report: Report) {
    this.modalProvider.open(EditReportsComponent, null, null, { report, id: this.company.id });
  }

  ready(report: Report): boolean {
    return isReady(report);
  }

}
