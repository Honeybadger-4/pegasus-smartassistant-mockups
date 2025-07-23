import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { KeyStatsCardComponent } from 'src/app/components/dashboard/key-stats-card/key-stats-card.component';
import { FlightCountCardComponent } from 'src/app/components/dashboard/flight-count-card/flight-count-card.component';
import { GpsSignalLossCardComponent } from 'src/app/components/dashboard/gps-signal-loss-card/gps-signal-loss-card.component';
import { TotalFuelOrderedCardComponent } from 'src/app/components/dashboard/total-fuel-ordered-card/total-fuel-ordered-card.component';
import { TopAlternateRoutesCardComponent } from 'src/app/components/dashboard/top-alternate-routes-card/top-alternate-routes-card.component';

export type DateRangeType = 'today' | '1month' | '6months';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToggleSwitch,
    ButtonModule,
    FlightCountCardComponent,
    TotalFuelOrderedCardComponent,
    GpsSignalLossCardComponent,
    TopAlternateRoutesCardComponent,
    KeyStatsCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  selectedRange = signal<DateRangeType>('6months');

  fallbackEnabled = false;

  selectRange(range: DateRangeType) {
    this.selectedRange.set(range);
  }
}
