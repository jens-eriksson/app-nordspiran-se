import { LayoutProvider } from 'src/app/layout/layout.provider';
import { Router, NavigationEnd } from '@angular/router';
import { Company } from './../../../../data/company';
import { ChartProvider } from './../../../../chart.provider';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-lynch-chart',
  templateUrl: './lynch-chart.component.html',
  styleUrls: ['./lynch-chart.component.scss']
})
export class LynchChartComponent implements OnInit {
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
      ['Period', 'Market Cap', 'Net Income TTM'],
    ];
    const reports = [...this._company.reports];
    reports.reverse().forEach(report => {
      if (report.netIncomeTTM && report.peTTM) {
        const row = [];
        row.push(report.period);
        row.push(report.marketCap);
        row.push(report.netIncomeTTM);
        data.push(row);
      }
    });
    const last = [];
    const date = new Date(1970, 0, 1);
    date.setSeconds(this._company.updated.seconds);
    last.push(date.toLocaleDateString('sv'));
    last.push(this._company.marketCap);
    last.push(null);
    data.push(last);

    const ticks = this.getTicks(this._company);

    const dataTable = this.google.visualization.arrayToDataTable(data);

    const options = {
      curveType: 'function',
      legend: { position: 'bottom' },
      height: 500,
      series: {
        0: {targetAxisIndex: 0},
        1: {targetAxisIndex: 1, type: 'line', color: 'green'},
        2: {targetAxisIndex: 1, type: 'bars', color: 'orange'}
      },
      vAxes: {
        0: {title: 'Market Cap', ticks: ticks.marketCap, viewWindow: { max: ticks.marketCap[ticks.marketCap.length - 1] }},
        1: {title: 'Net Income TTM', ticks: ticks.netIncomeTTM, viewWindow: { max: ticks.netIncomeTTM[ticks.netIncomeTTM.length - 1], min: 0 }}
      },
      hAxis: {
        showTextEvery: 1,
        slantedText: true,
        slantedTextAngle: 60
      },
      chartArea: {
        top: 30,
        left: 100,
        right: 100
      }
    };

    const chart = new this.google.visualization.LineChart(document.getElementById('lynch-chart'));

    chart.draw(dataTable, options);
  }

  getTicks(company) {
    let marketCapMax = 0;
    const reports = [...company.reports];
    const ticks = {
      marketCap: [],
      netIncomeTTM: [],
      periods: []
    };
    reports.reverse().forEach(report => {
      if (report.marketCap > marketCapMax) {
        marketCapMax = report.marketCap;
      }
      ticks.periods.push(report.peroid);
    });
    marketCapMax = Math.ceil(marketCapMax);
    let length = marketCapMax.toString().length;
    length = length - 2;
    const maxString = marketCapMax.toString();
    let max = (Number.parseInt(maxString.substring(0, 2), 10) + 1);
    max = max * Math.pow(10, length);
    for (let j = 0; j <= max; j = j + max / 10) {
      ticks.marketCap.push(j);
      ticks.netIncomeTTM.push(j / 10);
    }
    return ticks;
  }
}
