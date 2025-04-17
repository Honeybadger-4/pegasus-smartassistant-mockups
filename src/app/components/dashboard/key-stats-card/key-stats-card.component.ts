import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
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
export class KeyStatsCardComponent implements OnChanges {
  @Input() selectedRange: DateRangeType = '6months';

  flightService = inject(FlightInformationService);

  titleSuffix = '';
  rawStats = signal<IKeyStatsResponse | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRange']) {
      this.titleSuffix = getTitleSuffix(this.selectedRange);
      this.getStats();
    }
  }

  getStats(): void {
    const { startDate, endDate } = getDateRange(this.selectedRange);

    this.flightService.getFlightInfoStats(startDate, endDate).subscribe((data) => {
      this.rawStats.set(data);
    });
  }
}
