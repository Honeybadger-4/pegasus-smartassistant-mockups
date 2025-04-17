import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomLineChartComponent } from '@shared/components/custom-line-chart/custom-line-chart.component';
import { FuelOrderService } from '@shared/services/fuel-order.service';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';
import { getDateRange, getTitleSuffix } from '@shared/utils/date-range.util';
import moment from 'moment';

@Component({
  selector: 'app-total-fuel-ordered-card',
  standalone: true,
  imports: [CommonModule, CustomLineChartComponent],
  templateUrl: './total-fuel-ordered-card.component.html',
  styleUrl: './total-fuel-ordered-card.component.scss',
})
export class TotalFuelOrderedCardComponent implements OnChanges {
  @Input() selectedRange: DateRangeType = '6months';
  fuelOrderService = inject(FuelOrderService);

  chartData = signal<any>(null);
  chartOptions = signal<any>(null);
  titleSuffix = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRange']) {
      this.titleSuffix = getTitleSuffix(this.selectedRange);
      this.fetchFuelData();
    }
  }

  fetchFuelData() {
    const { startDate, endDate } = getDateRange(this.selectedRange);

    this.fuelOrderService.getDailySum(startDate, endDate).subscribe((res) => {
      const grouped: { [month: string]: number } = {};

      res.forEach((item) => {
        const month = moment(item.day).format('MMM');
        grouped[month] = (grouped[month] || 0) + item.total;
      });

      const labels = Object.keys(grouped);
      const data = Object.values(grouped);

      this.chartData.set({
        labels,
        datasets: [
          {
            label: 'Fuel Order',
            data,
            fill: false,
            borderColor: '#E142BC',
            tension: 0.4,
            backgroundColor: '#D946EF',
            pointRadius: 2,
            borderWidth: 2,
          },
        ],
      });

      this.chartOptions.set({
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 15, 
          }
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
            ticks: { color: '#515B66' },
            grid: { color: '#e0e0e0' },
          },
        },
      });
    });
  }
}
