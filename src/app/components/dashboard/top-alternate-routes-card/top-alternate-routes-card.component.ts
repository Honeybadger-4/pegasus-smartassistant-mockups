import { Component, effect, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomBarChartComponent } from '../../../shared/components/custom-bar-chart/custom-bar-chart.component';
import { ITopAlternatesResponse } from '@shared/models/top-alternates-response.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-top-alternate-routes-card',
  imports: [CommonModule, CustomBarChartComponent, ProgressSpinnerModule],
  templateUrl: './top-alternate-routes-card.component.html',
  styleUrl: './top-alternate-routes-card.component.scss',
})
export class TopAlternateRoutesCardComponent {
  topAlternatesData = input<ITopAlternatesResponse[]>([]);
  topAlternatesCardLoading = input<boolean>(false);

  chartData = signal<any>({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
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
        borderRadius: 5,
      },
    ],
  });

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

  constructor() {
    effect(() => {
      this.defineChartData();
    });
  }

  ngOnInit() {}

  defineChartData() {
    if (this.topAlternatesData().length > 0) {
      this.chartData.update((chart) => {
        return {
          ...chart,
          labels: this.topAlternatesData().map((item) => item.airportICAOCode),
          datasets: [
            {
              ...chart.datasets[0],
              data: this.topAlternatesData().map((item) => item.frequency),
            },
          ],
        };
      });
    } else {
      this.chartData.update((chart) => {
        return {
          ...chart,
          labels: [],
          datasets: [
            {
              ...chart.datasets[0],
              data: [],
            },
          ],
        };
      });
    }
  }
}
