import { Component, OnInit } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-boeing-info',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './boeing-info.component.html',
  styleUrl: './boeing-info.component.scss',
})
export class BoeingInfoComponent implements OnInit  {
  // SSR hatası alıyor isHighcharts kontrol'u olmayınca
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptionsDuty: Highcharts.Options = {};
  chartOptionsTime: Highcharts.Options = {};

  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart() {
    this.chartOptionsDuty = {
      chart: {
        type: 'pie',
        height: 270,
        width: 270,
        plotBackgroundColor: undefined,
        plotBorderWidth: 0,
        plotShadow: false,
      },
      title: { text: undefined },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false,
          },
          center: ['50%', '50%'],
          size: '100%',
          innerSize: '25%',
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: 'pie',
          name: 'Flight Data',
          innerSize: '65%',
          data: [
            { name: 'Flight Plan', y: 987, color: '#FED447' },
            { name: 'Load Sheet', y: 789, color: '#F79009' },
          ],
        },
      ],
    };

    this.chartOptionsTime = {
      chart: {
        type: 'pie',
        height: 270,
        width: 270,
        plotBackgroundColor: undefined,
        plotBorderWidth: 0,
        plotShadow: false,
      },
      title: { text: undefined },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false,
          },
          center: ['50%', '50%'],
          size: '100%',
          innerSize: '25%',
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: 'pie',
          name: 'Fuel Data',
          innerSize: '65%',
          data: [
            { name: 'Fuel Order', y: 789, color: '#3D348B' },
            { name: 'LMC', y: 234, color: '#7678ED' },
          ],
        },
      ],
    };
  }
}
