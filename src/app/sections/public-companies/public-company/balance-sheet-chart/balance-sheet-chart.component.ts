import { LayoutProvider } from 'src/app/layout/layout.provider';
import { Router } from '@angular/router';
import { Company } from '../../../../data/company';
import { ChartProvider } from '../../../../chart.provider';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-balance-sheet-chart',
  templateUrl: './balance-sheet-chart.component.html',
  styleUrls: ['./balance-sheet-chart.component.scss']
})
export class BalanceSheetChartComponent implements OnInit {
  private _company: Company;
  private google;
  @Input()
  set company(val: Company) {
    this._company = val;
    this.google.charts.setOnLoadCallback(this.drawChart.bind(this));
  }

  constructor(private chartProvider: ChartProvider, private layout: LayoutProvider) {
    this.google = this.chartProvider.getGoogle();
    this.google.charts.load('current', { packages: ['corechart'] });
  }

  ngOnInit(): void {
    this.layout.windowResize.subscribe(() => {
      this.drawChart();
    });
  }

  private drawChart() {
    const data = [
      ['Period', 'Assets', 'Equity', 'Solidity'],
    ];
    const reports = [...this._company.reports];
    reports.reverse().forEach(report => {
      if (report.assets && report.equity) {
        const row = [];
        row.push(report.period);
        row.push(report.assets);
        row.push(report.equity);
        row.push(report.solidity);
        data.push(row);
      }
    });

    const dataTable = this.google.visualization.arrayToDataTable(data);

    const options = {
      curveType: 'function',
      legend: { position: 'bottom' },
      height: 500,
      series: {
        0: {targetAxisIndex: 0, type: 'bars', color: 'blue'},
        1: {targetAxisIndex: 0, type: 'bars', color: 'green'},
        2: {targetAxisIndex: 1, type: 'line', color: 'orange'}
      },
      vAxes: {
        0: { title: '' },
        1: { format: 'percent'}
      },
      hAxis: {
        showTextEvery: 1,
        slantedText: true,
        slantedTextAngle: 60
      },
      chartArea: {
        top: 30,
        left: 60,
        right: 60
      }
    };

    const chart = new this.google.visualization.LineChart(document.getElementById('balance-sheet-chart'));

    chart.draw(dataTable, options);
  }
}