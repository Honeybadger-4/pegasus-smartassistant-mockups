import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomLineChartComponent } from '@shared/components/custom-line-chart/custom-line-chart.component';
import { FlightInformationService } from '@shared/services/flight-information.service';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';
import moment from 'moment';

@Component({
  selector: 'app-flight-count-card',
  standalone: true,
  imports: [CommonModule, CustomLineChartComponent],
  templateUrl: './flight-count-card.component.html',
  styleUrl: './flight-count-card.component.scss'
})
export class FlightCountCardComponent implements OnInit {
  @Input() selectedRange: DateRangeType = '6months';
  flightService = inject(FlightInformationService);

  chartData = signal<any>({
    labels: [],
    datasets: [
      {
        label: 'Flight Count',
        data: [],
        fill: false,
        borderColor: '#FEB914',
        backgroundColor: '#FEB914',
        tension: 0.4,
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

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnChanges(): void {
    this.fetchData();
  }

  fetchData() {
    const { startDate, endDate } = this.getDateRange(this.selectedRange);

    this.flightService.getDailyCount(startDate, endDate).subscribe({
      next: (res) => {
        const groupedByMonth = this.groupByMonth(res);
        this.chartData.set({
          labels: groupedByMonth.map((i) => i.label),
          datasets: [
            {
              ...this.chartData().datasets[0],
              data: groupedByMonth.map((i) => i.total),
            },
          ],
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
          startDate: today.clone().subtract(1, 'months').format('YYYY-MM-DD'),
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

  groupByMonth(data: { day: string; total: number }[]) {
    const map = new Map<string, number>();
    data.forEach((item) => {
      const month = moment(item.day).format('MMM');
      map.set(month, (map.get(month) || 0) + item.total);
    });

    return Array.from(map.entries()).map(([label, total]) => ({ label, total }));
  }
}
