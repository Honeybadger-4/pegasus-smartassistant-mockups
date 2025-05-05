import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightInformationService } from '@shared/services/flight-information.service';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';
import { IKeyStatsResponse } from '@shared/models/key-stats-response.model';
import { DashboardDateRangeService } from '@shared/services/helpers-services/dashboard-date-range.service';

@Component({
  selector: 'app-key-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-stats-card.component.html',
  styleUrl: './key-stats-card.component.scss',
})
export class KeyStatsCardComponent {
  flightService = inject(FlightInformationService);
  dashboardDateRangeService = inject(DashboardDateRangeService);

  selectedRange = input<DateRangeType>('6months');

  titleSuffix = signal<string>('');
  rawStats = signal<IKeyStatsResponse | null>(null);

  constructor() {
    effect(() => {
      this.titleSuffix.set(
        this.dashboardDateRangeService.getTitleSuffix(this.selectedRange()),
      );
      this.getStats();
    });
  }

  getStats(): void {
    const { startDate, endDate } = this.dashboardDateRangeService.getDateRange(
      this.selectedRange(),
    );

    this.flightService
      .getFlightInfoStats(startDate, endDate)
      .subscribe((data) => {
        this.rawStats.set(data);
      });
  }
}
