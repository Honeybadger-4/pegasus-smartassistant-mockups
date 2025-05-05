import { Injectable } from '@angular/core';
import moment from 'moment';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root',
})
export class DashboardDateRangeService {
  getDateRange(range: DateRangeType): {
    startDate: string;
    endDate: string;
  } {
    const today = moment();
    switch (range) {
      case 'today':
        return {
          startDate: today.format('YYYY-MM-DD'),
          endDate: today.format('YYYY-MM-DD'),
        };
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

  getTitleSuffix(range: DateRangeType): string {
    switch (range) {
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
