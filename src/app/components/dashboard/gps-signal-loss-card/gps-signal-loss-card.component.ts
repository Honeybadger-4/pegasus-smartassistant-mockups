import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDonutChartComponent } from '@shared/components/custom-donut-chart/custom-donut-chart.component';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';

@Component({
  selector: 'app-gps-signal-loss-card',
  standalone: true,
  imports: [CommonModule, CustomDonutChartComponent],
  templateUrl: './gps-signal-loss-card.component.html',
  styleUrl: './gps-signal-loss-card.component.scss',
})
export class GpsSignalLossCardComponent {
  selectedRange = input<DateRangeType>('6months');

  chartData = signal<any>({
    datasets: [
      {
        data: [500, 400, 300, 200, 100],
        backgroundColor: [
          '#FEB914',
          '#E142BC',
          '#068BEE',
          '#01B8CA',
          '#96DB33',
        ],
        hoverBackgroundColor: [
          '#FEB914',
          '#E142BC',
          '#068BEE',
          '#01B8CA',
          '#96DB33',
        ],
        borderWidth: 0,
      },
    ],
  });

  chartOptions = signal<any>({
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  });

  types = signal([
    { label: 'Type 1', value: 500, color: '#FEB914' },
    { label: 'Type 2', value: 400, color: '#E142BC' },
    { label: 'Type 3', value: 300, color: '#068BEE' },
    { label: 'Type 4', value: 200, color: '#01B8CA' },
    { label: 'Type 5', value: 100, color: '#96DB33' },
  ]);
}
