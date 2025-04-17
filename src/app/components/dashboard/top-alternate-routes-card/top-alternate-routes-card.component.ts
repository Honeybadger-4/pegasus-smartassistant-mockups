import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteService } from '@shared/services/route.service';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';
import { ITopAlternatesResponse } from '@shared/models/top-alternates-response.model';
import { getDateRange, getTitleSuffix } from '@shared/utils/date-range.util';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-top-alternate-routes-card',
  standalone: true,
  imports: [CommonModule,TableModule],
  templateUrl: './top-alternate-routes-card.component.html',
  styleUrl: './top-alternate-routes-card.component.scss',
})
export class TopAlternateRoutesCardComponent implements OnChanges {
  @Input() selectedRange: DateRangeType = '6months';

  routeService = inject(RouteService);

  titleSuffix = '';
  alternateRoutes = signal<ITopAlternatesResponse[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRange']) {
      this.titleSuffix = getTitleSuffix(this.selectedRange);
      this.loadAlternateRoutes();
    }
  }

  loadAlternateRoutes(): void {
    const { startDate, endDate } = getDateRange(this.selectedRange);

    this.routeService.getTopAlternates(startDate, endDate).subscribe((response) => {
      this.alternateRoutes.set(response);
    });
  }
}
