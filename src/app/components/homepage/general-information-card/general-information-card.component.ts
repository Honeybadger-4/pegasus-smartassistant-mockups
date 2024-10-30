import { Component, OnInit } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import Highcharts from 'highcharts';
import { CardsHeaderComponent } from "../cards-header/cards-header.component";

@Component({
  selector: 'app-combined-charts',
  standalone: true,
  imports: [HighchartsChartModule, CardsHeaderComponent],
  templateUrl: './general-information-card.component.html',
  styleUrls: ['./general-information-card.component.scss'],
})
export class GeneralInformationCardComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  chartOptionsGPSLoss: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: 170,
      width: 170,
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
  chartOptionsFuelExcess: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: 170,
      width: 170,
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

  constructor() {}

  ngOnInit(): void {
  }
}
