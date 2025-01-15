import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomBarChartComponent } from '../../../shared/components/custom-bar-chart/custom-bar-chart.component';

@Component({
  selector: 'app-top-alternate-routes-card',
  imports: [CommonModule, CustomBarChartComponent],
  templateUrl: './top-alternate-routes-card.component.html',
  styleUrl: './top-alternate-routes-card.component.scss',
})
export class TopAlternateRoutesCardComponent {
  chartData: any = {
    labels: ['LTBJ', 'LTBS', 'LTAY', 'LTAI', 'LTAI'],
    datasets: [
      {
        label: '',
        data: [500, 400, 300, 200, 100],
        backgroundColor: [
          '#FED447',
          '#FED447',
          '#FED447',
          '#FED447',
          '#FED447',
        ],
        borderColor: ['#FED447', '#FED447', '#FED447', '#FED447', '#FED447'],
        borderWidth: 1,
        barThickness: 60,
      },
    ],
  };

  chartOptions: any = {
    scales: {
      y: {
        ticks: {
          display: false,
        },
        grid: {
          color: '#4444444D',
          borderDash: [0],
          drawTicks: false,
        },
      },
      x: {
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  ngOnInit() {}
}
