import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomLineChartComponent } from '@shared/components/custom-line-chart/custom-line-chart.component';

@Component({
  selector: 'app-total-fuel-ordered-card',
  standalone: true,
  imports: [CommonModule, CustomLineChartComponent],
  templateUrl: './total-fuel-ordered-card.component.html',
  styleUrl: './total-fuel-ordered-card.component.scss'
})
export class TotalFuelOrderedCardComponent {
  @Input() selectedRange: string = '6months';

  chartData = signal<any>({
    labels: ['November', 'December', 'January', 'February', 'March'],
    datasets: [
      {
        label: 'Fuel Order',
        data: [200, 300, 250, 120, 290],
        fill: false,
        borderColor: '#E142BC',
        tension: 0.4,
        backgroundColor: '#D946EF',
        pointRadius: 2,
        borderWidth: 2,
      },
    ],
  });

  chartOptions = signal<any>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
        labels: {
          usePointStyle: true,
          pointStyle: 'rect',
          boxWidth: 10,
          boxHeight: 10,
          color: '#515B66',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#515B66',
        },
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 450,
        ticks: {
          stepSize: 150,
          color: '#515B66',
          callback: (value: number) => {
            if (value === 400) return '400';
            if (value === 200) return '200';
            if (value === 0) return '00';
            return value;
          },
        },
        grid: {
          color: '#e0e0e0',
        },
      },
    },
  });
}
