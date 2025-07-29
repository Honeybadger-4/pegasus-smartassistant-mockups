import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';

import { SystemPropertyService } from '@shared/services/system-property.service';
import { SystemPropertyAdminService } from '@shared/services/system-property-admin.service';

import { FlightCountCardComponent } from 'src/app/components/dashboard/flight-count-card/flight-count-card.component';
import { TotalFuelOrderedCardComponent } from 'src/app/components/dashboard/total-fuel-ordered-card/total-fuel-ordered-card.component';
import { KeyStatsCardComponent } from 'src/app/components/dashboard/key-stats-card/key-stats-card.component';
import { TopAlternateRoutesCardComponent } from 'src/app/components/dashboard/top-alternate-routes-card/top-alternate-routes-card.component';
import { GpsSignalLossCardComponent } from 'src/app/components/dashboard/gps-signal-loss-card/gps-signal-loss-card.component';

import { ISystemPropertyResponse } from '@shared/models/system-property-response.model';
import { ISystemPropertyAdminResponse } from '@shared/models/system-property-admin-response.model';

export type DateRangeType = 'today' | '1month' | '6months';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToggleSwitchModule,
    ButtonModule,
    FlightCountCardComponent,
    TotalFuelOrderedCardComponent,
    KeyStatsCardComponent,
    TopAlternateRoutesCardComponent,
    GpsSignalLossCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  selectedRange = signal<DateRangeType>('6months');
  fallbackEnabled = signal<boolean>(false);

  systemPropertyService = inject(SystemPropertyService);
  systemPropertyAdminService = inject(SystemPropertyAdminService);

  switchButtonLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadSwitch();
  }

  loadSwitch(): void {
    const switchKey = 'SYSTEM_LEVEL_SWITCH';

    this.systemPropertyService.getSystemLevelSwitch(switchKey).subscribe({
      next: (response: ISystemPropertyResponse) => {
        const isEnabled = response.value === 'ON';
        this.fallbackEnabled.set(isEnabled);
      },
      error: () => {
        console.error('Failed to load switch');
      },
    });
  }

  onToggleChange(enabled: boolean): void {
    const switchKey = 'SYSTEM_LEVEL_SWITCH';
    const switchValue = enabled ? 'ON' : 'OFF';

    this.switchButtonLoading.set(true);
    this.systemPropertyAdminService
      .updateSystemLevelSwitch(switchKey, switchValue)
      .subscribe({
        next: (response: ISystemPropertyAdminResponse) => {
          this.fallbackEnabled.set(enabled);
          this.switchButtonLoading.set(false);
        },
        error: () => {
          this.fallbackEnabled.set(!enabled);
          this.switchButtonLoading.set(false);
          console.error('Failed to update switch');
        },
      });
  }

  selectRange(range: DateRangeType): void {
    this.selectedRange.set(range);
  }
}

