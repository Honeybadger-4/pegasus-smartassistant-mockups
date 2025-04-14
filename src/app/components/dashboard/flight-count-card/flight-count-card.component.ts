import { Component, Input, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomLineChartComponent } from '@shared/components/custom-line-chart/custom-line-chart.component';
import { FlightInformationService } from '@shared/services/flight-information.service';
import { IDailyCountItem } from '@shared/models/daily-count-request.model';
import moment from 'moment';

@Component({
  selector: 'app-flight-count-card',
  standalone: true,
  imports: [CommonModule, CustomLineChartComponent],
  templateUrl: './flight-count-card.component.html',
  styleUrl: './flight-count-card.component.scss',
})
export class FlightCountCardComponent {
  @Input() selectedRange: string = '6months';

  private flightService = inject(FlightInformationService);
  private dailyCounts = signal<IDailyCountItem[]>([]);

  chartData = signal<any>({
    labels: [],
    datasets: [],
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
        max: 30000,
        ticks: {
          stepSize: 15000,
          color: '#515B66',
          callback: (value: number) => {
            if (value === 0) return '00';
            if (value === 15000) return '15k';
            if (value === 30000) return '30k';
            return '';
          },
        },
        grid: {
          color: '#e0e0e0',
        },
      },
    },
  });

  constructor() {
    effect(() => {
      const { startDate, endDate } = this.getDateRange(this.selectedRange);

      this.flightService.getDailyCount(startDate, endDate).subscribe({
        next: (response) => {
          this.dailyCounts.set(response);
          this.updateChartData();
        },
        error: (err) => {
          console.error('Daily count fetch error', err);
        },
      });
    });
  }

  private getDateRange(range: string): { startDate: string; endDate: string } {
    const today = moment();
    let startDate = today.clone();

    if (range === '1month') {
      startDate = today.clone().subtract(1, 'month');
    } else if (range === '6months') {
      startDate = today.clone().subtract(6, 'month');
    }

    return {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: today.format('YYYY-MM-DD'),
    };
  }

  private updateChartData() {
    const dailyData = this.dailyCounts();

    const monthlyGroups = dailyData.reduce((acc, item) => {
      const monthLabel = moment(item.day).format('MMMM');
      acc[monthLabel] = (acc[monthLabel] || 0) + item.total;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(monthlyGroups);
    const totals = Object.values(monthlyGroups);

    this.chartData.set({
      labels,
      datasets: [
        {
          label: 'Flight Count',
          data: totals,
          fill: false,
          borderColor: '#FEB914',
          tension: 0.4,
          backgroundColor: '#FEB914',
          pointRadius: 2,
          borderWidth: 2,
        },
      ],
    });
  }
}
