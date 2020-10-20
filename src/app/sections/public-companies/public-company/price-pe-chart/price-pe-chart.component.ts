import { LayoutProvider } from 'src/app/layout/layout.provider';
import { StockPricesProvider } from './../../../../data/stock-prices.provider';
import { Company } from '../../../../../../shared/company';
import { ChartProvider } from '../../../../chart.provider';
import { Component, OnInit, Input } from '@angular/core';
import { StockPrices } from '../../../../../../shared/stock-prices';

@Component({
  selector: 'app-price-pe-chart',
  templateUrl: './price-pe-chart.component.html',
  styleUrls: ['./price-pe-chart.component.scss']
})
export class PricePeChartComponent implements OnInit {
  chartType = 'stock-price';
  private _company: Company;
  private _stockPrices: StockPrices;
  private google;
  @Input()
  set company(val: Company) {
    this._company = val;
    this.stockPricesProvider.get(val.id).then(prices => {
      this._stockPrices = prices;
      this.select(this.chartType);
    });
  }

  constructor(private chartProvider: ChartProvider,
              private stockPricesProvider: StockPricesProvider
  ) {
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
    if (this.chartType === 'stock-price') {
      this.google.charts.setOnLoadCallback(this.drawStockPriceChart.bind(this));
    } else if (this.chartType === 'pe') {
      this.google.charts.setOnLoadCallback(this.drawPeChart.bind(this));
    }
  }
  private drawStockPriceChart() {
    const data = [
      ['Day', 'Stock Price, ' + this._company.stockPriceCurrency],
    ];
    this._stockPrices.days.slice(0, 365).reverse().forEach(day => {
      const date = new Date(1970, 0, 1);
      date.setSeconds(day.date['seconds']);
      const row = [];
      row.push(date.toLocaleDateString('sv'));
      row.push(day.price);
      data.push(row);
    });

    const dataTable = this.google.visualization.arrayToDataTable(data);

    const options = {
      curveType: 'function',
      legend: { position: 'bottom' },
      height: 500,
      series: {
        0: {targetAxisIndex: 0}
      },
      hAxis: {
        showTextEvery: 1,
        slantedText: true,
        slantedTextAngle: 60
      },
      chartArea: {
        top: 30,
        left: 60,
        right: 40
      }
    };

    const chart = new this.google.visualization.LineChart(document.getElementById('price-pe-chart'));

    chart.draw(dataTable, options);
  }

  private drawPeChart() {
    const data = [
      ['Period', 'P/E TTM'],
    ];
    const reports = [...this._company.reports];
    reports.reverse().forEach(report => {
      if (report.peTTM) {
        const row = [];
        row.push(report.period);
        row.push(report.peTTM);
        data.push(row);
      }
    });
    const last = [];
    const date = new Date(1970, 0, 1);
    date.setSeconds(this._company.updated.seconds);
    last.push(date.toLocaleDateString('sv'));
    last.push(this._company.peCurrent);
    data.push(last);

    const dataTable = this.google.visualization.arrayToDataTable(data);

    const options = {
      curveType: 'function',
      legend: { position: 'bottom' },
      height: 500,
      series: {
        0: {targetAxisIndex: 0}
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

    const chart = new this.google.visualization.LineChart(document.getElementById('price-pe-chart'));

    chart.draw(dataTable, options);
  }
}
