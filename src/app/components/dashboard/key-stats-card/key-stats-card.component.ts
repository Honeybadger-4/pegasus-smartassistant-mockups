import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightInformationService } from '@shared/services/flight-information.service';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';
import { IKeyStatsResponse } from '@shared/models/key-stats-response.model';
import { getDateRange, getTitleSuffix } from '@shared/utils/date-range.util';

@Component({
  selector: 'app-key-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-stats-card.component.html',
  styleUrl: './key-stats-card.component.scss',
})
export class KeyStatsCardComponent {
  flightService = inject(FlightInformationService);

  selectedRange = input<DateRangeType>('6months');

  titleSuffix = signal<string>('');
  rawStats = signal<IKeyStatsResponse | null>(null);

  constructor() {
    effect(() => {
      this.titleSuffix.set(getTitleSuffix(this.selectedRange()));
      this.getStats();
    });
  }

  getStats(): void {
    const { startDate, endDate } = getDateRange(this.selectedRange());

    this.flightService
      .getFlightInfoStats(startDate, endDate)
      .subscribe((data) => {
        this.rawStats.set(data);
      });
  }
}
