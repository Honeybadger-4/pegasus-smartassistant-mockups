import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';
import { FuelOrderService } from '@shared/services/fuel-order.service';
import { CustomLineChartComponent } from '@shared/components/custom-line-chart/custom-line-chart.component';
import moment from 'moment';
import { DashboardDateRangeService } from '@shared/services/helpers-services/dashboard-date-range.service';

@Component({
  selector: 'app-total-fuel-ordered-card',
  standalone: true,
  imports: [CommonModule, CustomLineChartComponent],
  templateUrl: './total-fuel-ordered-card.component.html',
  styleUrl: './total-fuel-ordered-card.component.scss',
})
export class TotalFuelOrderedCardComponent {
  fuelOrderService = inject(FuelOrderService);
  dashboardDateRangeService = inject(DashboardDateRangeService);

  selectedRange = input<DateRangeType>('6months');

  titleSuffix = signal<string>('');
  chartData = signal<any>(null);
  chartOptions = signal<any>(null);

  constructor() {
    effect(() => {
      this.titleSuffix.set(
        this.dashboardDateRangeService.getTitleSuffix(this.selectedRange()),
      );
      this.loadFuelData();
    });
  }

  loadFuelData(): void {
    const { startDate, endDate } = this.dashboardDateRangeService.getDateRange(
      this.selectedRange(),
    );

    this.fuelOrderService
      .getDailySum(startDate, endDate)
      .subscribe((response) => {
        const monthlyTotal = new Map<string, number>();

        response.forEach((item) => {
          const month = moment(item.day).format('MMMM');
          monthlyTotal.set(month, (monthlyTotal.get(month) || 0) + item.total);
        });

        const labels = Array.from(monthlyTotal.keys());
        const values = Array.from(monthlyTotal.values());

        this.setChart(labels, values);
      });
  }

  setChart(labels: string[], values: number[]): void {
    this.chartData.set({
      labels: labels,
      datasets: [
        {
          label: 'Fuel Order',
          data: values,
          fill: false,
          borderColor: '#E142BC',
          backgroundColor: '#D946EF',
          tension: 0.4,
          pointRadius: 2,
          borderWidth: 2,
        },
      ],
    });

    this.chartOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { bottom: 15 },
      },
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
          ticks: { color: '#515B66' },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#515B66',
            callback: (val: number) => (val === 0 ? '00' : `${val / 1000}k`),
          },
          grid: { color: '#e0e0e0' },
        },
      },
    });
  }
}
