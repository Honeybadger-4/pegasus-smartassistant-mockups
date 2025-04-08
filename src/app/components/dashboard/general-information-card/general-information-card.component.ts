import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDonutChartComponent } from '@shared/components/custom-donut-chart/custom-donut-chart.component';

@Component({
  selector: 'app-combined-charts',
  imports: [CommonModule, CustomDonutChartComponent],
  templateUrl: './general-information-card.component.html',
  styleUrls: ['./general-information-card.component.scss'],
})
export class GeneralInformationCardComponent implements OnInit {
  chartDataOne: any = {
    //labels: ['A', 'B', 'C'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#ECF39E', '#90A955', '#4F772D', '#31572C'],
        hoverBackgroundColor: ['#ECF39E', '#90A955', '#4F772D', '#31572C'],
        borderWidth: 0,
      },
    ],
  };

  chartOptionsOne: any = {
    cutout: '65%',
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
        backgroundColor: ['#5E548E', '#E0B1CB', '#BE95C4', '#9F86C0'],
        hoverBackgroundColor: ['#5E548E', '#E0B1CB', '#BE95C4', '#9F86C0'],
        borderWidth: 0,
      },
    ],
  };

  chartOptionsTwo: any = {
    cutout: '65%',
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
