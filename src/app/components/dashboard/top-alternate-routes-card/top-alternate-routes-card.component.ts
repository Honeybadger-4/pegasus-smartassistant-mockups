import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteService } from '@shared/services/route.service';
import { ITopAlternatesResponse } from '@shared/models/top-alternates-response.model';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';
import moment from 'moment';

@Component({
  selector: 'app-top-alternate-routes-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-alternate-routes-card.component.html',
  styleUrl: './top-alternate-routes-card.component.scss',
})
export class TopAlternateRoutesCardComponent implements OnInit {
  @Input() selectedRange: DateRangeType = '6months';
  routeService = inject(RouteService);

  routeList = signal<{ route: string; fromTo: string; count: number }[]>([]);

  ngOnInit() {
    this.fetchData();
  }

  ngOnChanges() {
    this.fetchData();
  }

  fetchData() {
    const { startDate, endDate } = this.getDateRange(this.selectedRange);

    this.routeService.getTopAlternates(startDate, endDate).subscribe({
      next: (res: ITopAlternatesResponse[]) => {
        const formatted = res.map((r) => ({
          route: r.airportICAOCode,
          fromTo: `${r.depPort} - ${r.arrPort}`,
          count: r.frequency,
        }));
        this.routeList.set(formatted);
      },
      error: (err) => console.error(err),
    });
  }

  get titleText(): string {
    switch (this.selectedRange) {
      case 'today':
        return 'Top 5 Most Used Alternate Routes (Today)';
      case '1month':
        return 'Top 5 Most Used Alternate Routes (Last 1 Month)';
      case '6months':
      default:
        return 'Top 5 Most Used Alternate Routes (Last 6 Months)';
    }
  }

  get mappedData() {
    return this.routeList();
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
}
