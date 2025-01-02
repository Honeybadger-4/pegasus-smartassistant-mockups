import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomBarChartComponent } from '../../../shared/components/custom-bar-chart/custom-bar-chart.component';

@Component({
  selector: 'app-top-alternate-routes-card',
  standalone: true,
  imports: [CommonModule,CustomBarChartComponent],
  templateUrl: './top-alternate-routes-card.component.html',
  styleUrl: './top-alternate-routes-card.component.scss',
})
export class TopAlternateRoutesCardComponent {
  chartData: any = {
    labels: ['LTBJ', 'LTBS', 'LTAY', 'LTAI'],
    datasets: [
      {
        label: '',
        data: [500, 400, 300, 200],
        backgroundColor: ['#FED447', '#FED447', '#FED447', '#FED447'],
        borderColor: ['#FED447', '#FED447', '#FED447', '#FED447'],
        borderWidth: 1,
      },
    ],
  };

  chartOptions: any = {
    plugins: {
      legend: {
        labels: {
          color: '#444444',
        },
      },
    },
  };

  ngOnInit() {}
}
