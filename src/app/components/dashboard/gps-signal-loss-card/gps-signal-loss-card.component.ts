import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDonutChartComponent } from '@shared/components/custom-donut-chart/custom-donut-chart.component';

@Component({
  selector: 'app-gps-signal-loss-card',
  standalone: true,
  imports: [CommonModule, CustomDonutChartComponent],
  templateUrl: './gps-signal-loss-card.component.html',
  styleUrl: './gps-signal-loss-card.component.scss'
})
export class GpsSignalLossCardComponent {
  chartData = signal<any>({
    datasets: [
      {
        data: [312, 264, 347, 654, 633],
        backgroundColor: ['#F4B740', '#C86DD7', '#1479F2', '#2DCCD3', '#7ED321'],
        hoverBackgroundColor: ['#F4B740', '#C86DD7', '#1479F2', '#2DCCD3', '#7ED321'],
        borderWidth: 0,
      },
    ],
  });

  chartOptions = signal<any>({
    cutout: '65%',
    plugins: {
      legend: {
        display: false,
      },
    },
  });

  types = signal([
    { label: 'Type 1', value: 312, color: '#F4B740' },
    { label: 'Type 2', value: 264, color: '#C86DD7' },
    { label: 'Type 3', value: 347, color: '#1479F2' },
    { label: 'Type 4', value: 654, color: '#2DCCD3' },
    { label: 'Type 5', value: 633, color: '#7ED321' },
  ]);
}
