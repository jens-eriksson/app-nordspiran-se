import { LayoutProvider } from 'src/app/layout/layout.provider';
import { ChartProvider } from './../../../../chart.provider';
import { Company } from './../../../../data/company';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dividend-chart',
  templateUrl: './dividend-chart.component.html',
  styleUrls: ['./dividend-chart.component.scss']
})
export class DividendChartComponent implements OnInit {
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
      ['Year', 'OCF/Share', 'FCF/Share', 'Dividend/Share'],
    ];
    const dividend = [...this._company.dividend];
    dividend.forEach(d => {
      const row = [];
      row.push(d.year);
      row.push(d.operatingCashflow);
      row.push(d.freeCashflow);
      row.push(d.dividend);
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
        2: {targetAxisIndex: 0, type: 'bars', color: 'black'}
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

    const chart = new this.google.visualization.LineChart(document.getElementById('dividend-chart'));

    chart.draw(dataTable, options);
  }

}
