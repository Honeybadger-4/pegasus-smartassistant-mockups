import { Component, inject, signal } from '@angular/core';

import { GeneralInformationCardComponent } from 'src/app/components/homepage/general-information-card/general-information-card.component';
import { TopAlternateRoutesCardComponent } from '../../components/homepage/top-alternate-routes-card/top-alternate-routes-card.component';
import { TotalFlightsComponent } from 'src/app/components/homepage/total-flights/total-flights.component';

import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { RouteService } from '@shared/services/route.service';
import moment from 'moment';
import { ITopAlternatesResponse } from '@shared/models/top-alternates-response.model';
import { FlightInformationService } from '@shared/services/flight-information.service';
import { IFlightInfoStatsResponse } from '@shared/models/flight-info-stats-response.model';

@Component({
  selector: 'app-homepage',
  imports: [
    TotalFlightsComponent,
    //GeneralInformationCardComponent,
    TopAlternateRoutesCardComponent,
    DatePickerModule,
    FormsModule,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  routeService = inject(RouteService);
  flightInfoService = inject(FlightInformationService);

  totalFlightsData = signal<IFlightInfoStatsResponse | null>(null);
  totalFlightsCardLoading = signal<boolean>(false);
  topAlternatesData = signal<ITopAlternatesResponse[]>([]);
  topAlternatesCardLoading = signal<boolean>(false);

  startDate = signal<string>('');
  endDate = signal<string>('');
  dateRange: Date[] = [];

  ngOnInit() {
    this.dateRange = this.dateRangeDefaultValue();
    this.getTotalFlights();
    this.getTopAlternates();
  }

  getTotalFlights() {
    this.totalFlightsCardLoading.set(true);

    this.flightInfoService
      .getFlightInfoStats(this.startDate(), this.endDate())
      .subscribe({
        next: (response) => {
          this.totalFlightsData.set(response);
          this.totalFlightsCardLoading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.totalFlightsCardLoading.set(false);
        },
      });
  }

  getTopAlternates() {
    this.topAlternatesCardLoading.set(true);

    this.routeService
      .getTopAlternates(this.startDate(), this.endDate(), 5)
      .subscribe({
        next: (response) => {
          this.topAlternatesData.set(response);
          this.topAlternatesCardLoading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.topAlternatesCardLoading.set(false);
        },
      });
  }

  onDateRangeChange(event: any) {
    const [start, end] = event;

    if (start && end) {
      this.startDate.set(moment(start).format('YYYY-MM-DD'));
      this.endDate.set(moment(end).format('YYYY-MM-DD'));

      this.getTotalFlights();
      this.getTopAlternates();
    }
  }

  dateRangeDefaultValue() {
    const startDate = moment().startOf('month');
    const endDate = moment().endOf('month');

    this.startDate.set(moment(startDate).format('YYYY-MM-DD'));
    this.endDate.set(moment(endDate).format('YYYY-MM-DD'));

    return [startDate.toDate(), endDate.toDate()];
  }
}
