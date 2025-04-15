import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomLineChartComponent } from '@shared/components/custom-line-chart/custom-line-chart.component';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';
import { FuelOrderService } from '@shared/services/fuel-order.service';
import moment from 'moment';

@Component({
  selector: 'app-total-fuel-ordered-card',
  standalone: true,
  imports: [CommonModule, CustomLineChartComponent],
  templateUrl: './total-fuel-ordered-card.component.html',
  styleUrl: './total-fuel-ordered-card.component.scss'
})
export class TotalFuelOrderedCardComponent implements OnInit {
  @Input() selectedRange: DateRangeType = '6months';

  private fuelOrderService = inject(FuelOrderService);

  chartData = signal<any>(null);
  chartOptions = signal<any>(null);

  ngOnInit(): void {
    this.fetchFuelData();
  }

  ngOnChanges(): void {
    this.fetchFuelData();
  }

  fetchFuelData() {
    const { startDate, endDate } = this.getDateRange(this.selectedRange);

    this.fuelOrderService.getDailySum(startDate, endDate).subscribe({
      next: (res) => {
        const grouped: { [month: string]: number } = {};

        res.forEach((item) => {
          const month = moment(item.day).format('MMMM'); 
          if (!grouped[month]) grouped[month] = 0;
          grouped[month] += item.total;
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
              beginAtZero: true,
              ticks: {
                color: '#515B66',
              },
              grid: {
                color: '#e0e0e0',
              },
            },
          },
        });
      },
      error: (err) => console.error(err),
    });
  }

  getDateRange(range: DateRangeType): { startDate: string; endDate: string } {
    const today = moment();
    switch (range) {
      case 'today':
        return { startDate: today.format('YYYY-MM-DD'), endDate: today.format('YYYY-MM-DD') };
      case '1month':
        return {
          startDate: today.clone().subtract(1, 'month').format('YYYY-MM-DD'),
          endDate: today.format('YYYY-MM-DD'),
        };
      case '6months':
      default:
        return {
          startDate: today.clone().subtract(6, 'months').format('YYYY-MM-DD'),
          endDate: today.format('YYYY-MM-DD'),
        };
    }
  }
}
