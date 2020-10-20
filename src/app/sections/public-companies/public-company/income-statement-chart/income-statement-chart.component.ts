import { LayoutProvider } from '../../../../layout/layout.provider';
import { Company } from '../../../../../../shared/company';
import { ChartProvider } from '../../../../chart.provider';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-income-statement-chart',
  templateUrl: './income-statement-chart.component.html',
  styleUrls: ['./income-statement-chart.component.scss']
})
export class IncomeStatementChartComponent implements OnInit {
  chartType = 'ttm';
  private _company: Company;
  private google;
  @Input()
  set company(val: Company) {
    this._company = val;
    this.drawChart();
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

  selectChart(type) {
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
      ['Period', 'Revenue TTM', 'Net Income TTM', 'Proft Margin TTM'],
    ];
    const reports = [...this._company.reports];
    reports.reverse().forEach(report => {
      if (report.netIncomeTTM && report.revenueTTM) {
        const row = [];
        row.push(report.period);
        row.push(report.revenueTTM);
        row.push(report.netIncomeTTM);
        row.push(report.profitMarginTTM);
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

    const chart = new this.google.visualization.LineChart(document.getElementById('income-statement-chart'));

    chart.draw(dataTable, options);
  }

  private drawQuarterChart() {
    const data = [
      ['Period', 'Revenue', 'Net Income'],
    ];
    const reports = [...this._company.reports];
    reports.reverse().forEach(report => {
      if (report.netIncome && report.revenue) {
        const row = [];
        row.push(report.period);
        row.push(report.revenue);
        row.push(report.netIncome);
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
        1: {targetAxisIndex: 0, type: 'bars', color: 'green'}
      },
      vAxes: {
        0: {
          title: '',
        }
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

    const chart = new this.google.visualization.LineChart(document.getElementById('income-statement-chart'));

    chart.draw(dataTable, options);
  }
}
