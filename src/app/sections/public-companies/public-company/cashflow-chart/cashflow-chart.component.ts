import { LayoutProvider } from 'src/app/layout/layout.provider';
import { Company } from './../../../../../../shared/company';
import { ChartProvider } from '../../../../chart.provider';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cashflow-chart',
  templateUrl: './cashflow-chart.component.html',
  styleUrls: ['./cashflow-chart.component.scss']
})
export class CashflowChartComponent implements OnInit {
  @Input() chartType = 'ttm';
  private _company: Company;
  private google;
  @Input()
  set company(val: Company) {
    this._company = val;
    this.select(this.chartType);
  }

  constructor(private chartProvider: ChartProvider) {
    this.google = this.chartProvider.getGoogle();
    this.google.charts.load('current', { packages: ['corechart'] });
  }

  ngOnInit(): void {
    window.onresize = () => {
      this.drawChart();
    }
  }

  select(type) {
    this.chartType = type;
    this.drawChart();
  }

  private drawChart() {
    if (this.chartType === 'ttm') {
      this.google.charts.setOnLoadCallback(this.drawTtmChart.bind(this));
    } else if (this.chartType === 'quarter') {
      this.google.charts.setOnLoadCallback(this.drawQuarterChart.bind(this));
    }
  }

  private drawTtmChart() {
    const data = [
      ['Period', 'Operating Cash Flow TTM', 'Free Cash Flow TTM', 'Net Cash Flow TTM'],
    ];
    const reports = [...this._company.reports];
    reports.reverse().forEach(report => {
      const row = [];
      row.push(report.period);
      row.push(report.operatingCashflowTTM);
      row.push(report.freeCashflowTTM);
      row.push(report.netCashflowTTM);
      data.push(row);
    });

    const dataTable = this.google.visualization.arrayToDataTable(data);

    const options = {
      curveType: 'function',
      legend: { position: 'bottom' },
      height: 500,
      series: {
        0: {targetAxisIndex: 0, type: 'bars', color: 'blue'},
        1: {targetAxisIndex: 0, type: 'bars', color: 'orange'},
        2: {targetAxisIndex: 0, type: 'bars', color: 'green'}
      },
      hAxis: {
        showTextEvery: 1,
        slantedText: true,
        slantedTextAngle: 60
      },
      chartArea: {
        top: 30,
        left: 60,
        right: 30
      }
    };

    const chart = new this.google.visualization.LineChart(document.getElementById('cashflow-chart'));

    chart.draw(dataTable, options);
  }
  private drawQuarterChart() {
    const data = [
      ['Period', 'Operating Cash Flow', 'Free Cash Flow', 'Net Cash Flow'],
    ];
    const reports = [...this._company.reports];
    reports.reverse().forEach(report => {
      const row = [];
      row.push(report.period);
      row.push(report.operatingCashflow);
      row.push(report.freeCashflow);
      row.push(report.netCashflow);
      data.push(row);
    });

    const dataTable = this.google.visualization.arrayToDataTable(data);

    const options = {
      curveType: 'function',
      legend: { position: 'bottom' },
      height: 500,
      series: {
        0: {targetAxisIndex: 0, type: 'bars', color: 'blue'},
        1: {targetAxisIndex: 0, type: 'bars', color: 'orange'},
        2: {targetAxisIndex: 0, type: 'bars', color: 'green'}
      },
      hAxis: {
        showTextEvery: 1,
        slantedText: true,
        slantedTextAngle: 60
      },
      chartArea: {
        top: 30,
        left: 60,
        right: 30
      }
    };

    const chart = new this.google.visualization.LineChart(document.getElementById('cashflow-chart'));

    chart.draw(dataTable, options);
  }
}


