import { ChartProvider } from '../../../../chart.provider';
import { Component, OnInit, Input } from '@angular/core';
import { StockPrices } from '../../../../../../shared/stock-prices';

@Component({
  selector: 'app-price-pe-chart',
  templateUrl: './price-pe-chart.component.html',
  styleUrls: ['./price-pe-chart.component.scss']
})
export class PricePeChartComponent implements OnInit {
  private _stockPrices: StockPrices;
  private google;
  @Input()
  set stockPrices(val: StockPrices) {
    this._stockPrices = val;
    this.google.charts.setOnLoadCallback(this.drawChart.bind(this));
  }
  days = 255;

  constructor(
    private chartProvider: ChartProvider
  ) {
    this.google = this.chartProvider.getGoogle();
    this.google.charts.load('current', { packages: ['corechart'] });
  }

  ngOnInit(): void { 
  }

  private drawChart() {
    if(!this._stockPrices) {
      return;
    }
    const data = [
      ['Day', 'Stock Price, ' + this._stockPrices.currency, 'P/E'],
    ];
    let priceDays = [ ...this._stockPrices.days ];
    if(priceDays.length >= this.days) {
      priceDays = priceDays.slice(0, this.days);
    }
    priceDays.reverse().forEach(day => {
      const date = new Date(1970, 0, 1);
      date.setSeconds(day.date['seconds']);
      const row = [];
      row.push(date.toLocaleDateString('sv'));
      row.push(day.stockPrice ? day.stockPrice : null);
      row.push(day.pe ? day.pe : null);
      data.push(row);
    });

    const dataTable = this.google.visualization.arrayToDataTable(data);

    const options = {
      curveType: 'function',
      legend: { position: 'bottom' },
      height: 500,
      series: {
        0: {targetAxisIndex: 0, type: 'line', color: 'blue'},
        1: {targetAxisIndex: 1, type: 'line', color: 'orange'}
      },
      vAxes: {
        0: {title: 'Stock Price'},
        1: {title: 'P/E', viewWindow: { min: 0 }}
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

    const chart = new this.google.visualization.LineChart(document.getElementById('price-pe-chart'));

    chart.draw(dataTable, options);
  }

  setDays(days) {
    this.days = days;
    this.drawChart();
  }
}
