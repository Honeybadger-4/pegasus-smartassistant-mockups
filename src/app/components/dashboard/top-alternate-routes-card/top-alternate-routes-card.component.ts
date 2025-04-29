import {
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouteService } from '@shared/services/route.service';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';
import { getDateRange, getTitleSuffix } from '@shared/utils/date-range.util';
import { ITopAlternatesResponse } from '@shared/models/top-alternates-response.model';

import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-top-alternate-routes-card',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './top-alternate-routes-card.component.html',
  styleUrl: './top-alternate-routes-card.component.scss',
})
export class TopAlternateRoutesCardComponent {
  routeService = inject(RouteService);

  selectedRange = input<DateRangeType>('6months');

  titleSuffix = signal<string>('');
  alternateRoutes = signal<ITopAlternatesResponse[]>([]);

  constructor() {
    effect(() => {
      this.titleSuffix.set(getTitleSuffix(this.selectedRange()));
      this.loadAlternateRoutes();
    })
  }

  loadAlternateRoutes(): void {
    const { startDate, endDate } = getDateRange(this.selectedRange());

    this.routeService
      .getTopAlternates(startDate, endDate)
      .subscribe((response) => {
        this.alternateRoutes.set(response);
      });
  }
}
