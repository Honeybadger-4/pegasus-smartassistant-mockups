import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDonutChartComponent } from '../../../shared/components/custom-donut-chart/custom-donut-chart.component';

@Component({
  selector: 'app-total-flights',
  imports: [CommonModule, CustomDonutChartComponent],
  templateUrl: './total-flights.component.html',
  styleUrls: ['./total-flights.component.scss'],
})
export class TotalFlightsComponent implements OnInit {
  chartDataOne: any = {
    //labels: ['A', 'B', 'C'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#F79009', '#D62828', '#FED447'],
        hoverBackgroundColor: ['#F79009', '#D62828', '#FED447'],
      },
    ],
  };

  chartOptionsOne: any = {
    cutout: '60%',
    plugins: {
      legend: {
        labels: {
          //color: "blue"
        },
      },
    },
  };

  chartDataTwo: any = {
    //labels: ['A', 'B', 'C'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#092FF7', '#3D348B', '#7678ED'],
        hoverBackgroundColor: ['#092FF7', '#3D348B', '#7678ED'],
      },
    ],
  };

  chartOptionsTwo: any = {
    cutout: '60%',
    plugins: {
      legend: {
        labels: {
          //color: "blue"
        },
      },
    },
  };

  ngOnInit(): void {}
}
