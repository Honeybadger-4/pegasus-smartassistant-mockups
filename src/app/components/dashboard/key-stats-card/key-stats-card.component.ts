import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightInformationService } from '@shared/services/flight-information.service';
import { IKeyStatsResponse } from '@shared/models/key-stats-response.model';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';
import moment from 'moment';

@Component({
  selector: 'app-key-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-stats-card.component.html',
  styleUrl: './key-stats-card.component.scss',
})
export class KeyStatsCardComponent implements OnInit {
  @Input() selectedRange: DateRangeType = '6months';

  private flightService = inject(FlightInformationService);

  stats = signal<{ value: number; label: string }[]>([]);

  ngOnInit(): void {
    this.fetchStats();
  }

  ngOnChanges(): void {
    this.fetchStats();
  }

  fetchStats() {
    const { startDate, endDate } = this.getDateRange(this.selectedRange);

    this.flightService.getFlightInfoStats(startDate, endDate).subscribe((res: IKeyStatsResponse) => {
      this.stats.set([
        { value: res.totalFlightHours, label: 'Total Flight Time' },
        { value: res.gpsLossForm, label: 'GPS Loss Form Created' },
        { value: res.flightPlans, label: 'Flight Plan Created' },
      ]);
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

  getTitleSuffix(): string {
    switch (this.selectedRange) {
      case 'today':
        return 'Today';
      case '1month':
        return 'Last 1 Month';
      case '6months':
      default:
        return 'Last 6 Months';
    }
  }
  
}
