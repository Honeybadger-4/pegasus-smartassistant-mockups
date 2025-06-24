import { Component, signal } from '@angular/core';
import { ChartData, ChartOptions, ChartType, Point } from 'chart.js';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-cg-limits-chart',
  imports: [ChartModule],
  templateUrl: './cg-limits-chart.component.html',
  styleUrl: './cg-limits-chart.component.scss',
})
export class CgLimitsChartComponent {
  data: any;
  options: any;

  ngOnInit(): void {
    this.data = {
      datasets: [
        {
          label: 'LW Envelope',
          data: [
            { x: 30, y: 45000 },
            { x: 20, y: 72000 },
            { x: 28, y: 80000 },
            { x: 50, y: 80000 },
            { x: 55, y: 75000 },
            { x: 45, y: 60000 },
            { x: 40, y: 45000 },
            { x: 30, y: 45000 }, // Closing the envelope
          ],
          borderColor: 'rgba(0, 128, 255, 1)',
          backgroundColor: 'rgba(0, 128, 255, 0.2)',
          fill: true,
          tension: 0,
          pointRadius: 0,
          borderWidth: 2,
          showLine: true,
        },

        {
          label: 'ZFW',
          type: 'scatter',
          data: [{ x: 38, y: 68000 }],
          backgroundColor: 'green',
          pointRadius: 6,
        },

        {
          label: 'TOW',
          type: 'scatter',
          data: [{ x: 39, y: 70000 }],
          backgroundColor: 'white',
          borderColor: 'gray',
          borderWidth: 1,
          pointRadius: 6,
        },

        {
          label: 'LW',
          type: 'scatter',
          data: [{ x: 40, y: 72000 }],
          backgroundColor: 'blue',
          pointRadius: 6,
        },
      ],
    };

    this.options = {
      responsive: true,
      scales: {
        x: {
          min: 20,
          max: 55,
          grid: {
            color: '#fff',
          },
          ticks: {
            color: 'white',
          },
        },
        y: {
          min: 35000,
          max: 90000,
          grid: {
            color: 'gray',
          },
          ticks: {
            color: 'white',
          },
        },
      },
    };
  }
}
