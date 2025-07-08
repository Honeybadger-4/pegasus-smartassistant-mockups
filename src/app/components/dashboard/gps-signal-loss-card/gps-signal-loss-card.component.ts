import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDonutChartComponent } from '@shared/components/custom-donut-chart/custom-donut-chart.component';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';
import { DashboardDateRangeService } from '@shared/services/helpers-services/dashboard-date-range.service';

import { GpsSignalLossService } from '@shared/services/gps-signal-loss.service';
@Component({
  selector: 'app-gps-signal-loss-card',
  standalone: true,
  imports: [CommonModule, CustomDonutChartComponent],
  templateUrl: './gps-signal-loss-card.component.html',
  styleUrl: './gps-signal-loss-card.component.scss',
})
export class GpsSignalLossCardComponent {
  selectedRange = input<DateRangeType>('6months');
  gpsLossService = inject(GpsSignalLossService);
  dashboardDateRangeService = inject(DashboardDateRangeService);

  chartData = signal<any>(null);
  chartOptions = signal<any>(null);
  types = signal<{ label: string; value: number; color: string }[]>([]);
  titleSuffix = signal<string>('');

  colorPalette = [
    '#392B7B', // Gece Menekşe
    '#E83E8C', // Yoğun Pembe
    '#FD7E14', // Enerjik Turuncu
    '#28A745', // Başarı Yeşili
    '#FFC107', // Parlayan Amber
    '#007BFF', // Canlı Mavi
    '#DC3545', // Vurgu Kırmızısı
    '#20C997', // Sakin Turkuaz
    '#BB33FF', // Parlak Lavanta
  ];
  constructor() {
    effect(() => {
      this.titleSuffix.set(
        this.dashboardDateRangeService.getTitleSuffix(this.selectedRange()),
      );
      this.loadGpsData();
    });
  }

  loadGpsData() {
    const { startDate, endDate } = this.dashboardDateRangeService.getDateRange(
      this.selectedRange(),
    );

    this.gpsLossService
      .getImpactStats(startDate, endDate)
      .subscribe((response) => {
        const typesList = response.map((item, index) => ({
          label: this.formatType(item.type),
          value: item.count,
          color: this.colorPalette[index % this.colorPalette.length],
        }));

        this.types.set(typesList);

        this.chartData.set({
          datasets: [
            {
              data: typesList.map((t) => t.value),
              backgroundColor: typesList.map((t) => t.color),
              hoverBackgroundColor: typesList.map((t) => t.color),
              borderWidth: 0,
            },
          ],
        });

        this.chartOptions.set({
          cutout: '70%',
          plugins: { legend: { display: false } },
        });
      });
  }

  formatType(type: string): string {
    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  }
}
