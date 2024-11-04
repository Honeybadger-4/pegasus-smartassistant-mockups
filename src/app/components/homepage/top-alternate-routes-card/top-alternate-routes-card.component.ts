import { Component, OnInit } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import Highcharts from 'highcharts';
import { CardsHeaderComponent } from '../cards-header/cards-header.component';

@Component({
  selector: 'app-top-alternate-routes-card',
  standalone: true,
  imports: [HighchartsChartModule, CardsHeaderComponent],
  templateUrl: './top-alternate-routes-card.component.html',
  styleUrl: './top-alternate-routes-card.component.scss',
})
export class TopAlternateRoutesCardComponent {
  Highcharts: typeof Highcharts = Highcharts;

  chartOptionsAlternateRoutes: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: undefined,
    },
    title: { text: undefined },
    xAxis: {
      categories: ['LTBJ', 'LTBS', 'LTAY', 'LTAI', 'LTAI'],
      title: { text: null },
      labels: {
        style: {
          color: '#525252',
          fontFamily: 'DM Sans',
          fontSize: '12px',
          fontWeight: '500',
          lineHeight: '20px',
          letterSpacing: '-0.02em',
          textAlign: 'center',
        },
      },
    },
    yAxis: {
      min: 0,
      title: { text: undefined },
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      column: {
        colorByPoint: true,
        colors: ['#FED447'],
        borderWidth: 0,
        pointWidth: 39,
        groupPadding: 5,
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: 'column',
        name: 'Routes',
        data: [5, 4, 3, 2, 1],
      },
    ],
  };

  constructor() {}

  ngOnInit() {}
}
