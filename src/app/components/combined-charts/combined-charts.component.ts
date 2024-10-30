import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-combined-charts',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './combined-charts.component.html',
  styleUrls: ['./combined-charts.component.scss'],
})
export class CombinedChartsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  chartOptionsGPSLoss: Highcharts.Options = {};  
  chartOptionsFuelExcess: Highcharts.Options = {}; 
  chartOptionsAlternateRoutes: Highcharts.Options = {}; 

  constructor() {}

  ngOnInit(): void {
    this.initializeCharts();
  }

  initializeCharts(): void {
    this.chartOptionsGPSLoss = {
      chart: {
        type: 'pie',
        height: 150,
        width: 150,
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
          size: '90%',
          innerSize: '65%',
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: 'pie',
          name: 'GPS Loss Data',
          innerSize: '65%',
          data: [
            { name: 'Surveillance System Affect', y: 40, color: '#31572C' },
            { name: 'Company Id', y: 35, color: '#4F772D' },
            { name: 'Loss of GPS1-2', y: 45, color: '#90A955' },
            { name: 'Switching to Alternative Mode', y: 23, color: '#ECF39E' },
          ],
        },
      ],
    };

    this.chartOptionsFuelExcess = {
      chart: {
        type: 'pie',
        height: 150,
        width: 150,
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
          size: '90%',
          innerSize: '65%',
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: 'pie',
          name: 'Fuel Excess Data',
          innerSize: '65%',
          data: [
            { name: 'Meteorology', y: 20, color: '#5E548E' },
            { name: 'Arrival/Departure Rwy Diff.', y: 15, color: '#E0B1CB' },
            { name: 'OCC Decision', y: 10, color: '#BE95C4' },
            { name: 'Traffic Congestion on Arr. Airp.', y: 17, color: '#9F86C0' },
          ],
        },
      ],
    };

    this.chartOptionsAlternateRoutes = {
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
            textAlign: 'center' 
          }
        }
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
        }
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false, 
      },
      series: [
        {
          type: 'column',
          name: 'Routes',
          data: [5, 4, 3, 2, 1],
        }
      ]
    };
    
    
    
  }
}
