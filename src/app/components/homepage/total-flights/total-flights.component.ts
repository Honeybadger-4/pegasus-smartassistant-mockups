import { Component, OnInit } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import Highcharts from 'highcharts';
import { CardsHeaderComponent } from '../cards-header/cards-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-total-flights',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule, CardsHeaderComponent],
  templateUrl: './total-flights.component.html',
  styleUrls: ['./total-flights.component.scss'],
})
export class TotalFlightsComponent implements OnInit {
  // SSR hatası alıyor isHighcharts kontrol'u olmayınca
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptionsFlights: Highcharts.Options = {};
  chartOptionsFuelOrder: Highcharts.Options = {};

  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart() {
    this.chartOptionsFlights = {
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
            { name: 'Trip Info', y: 234, color: '#D62828' },
          ],
        },
      ],
    };

    this.chartOptionsFuelOrder = {
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
            { name: 'GPS Loss Form', y: 143, color: '#092FF7' },
          ],
        },
      ],
    };
  }
}
