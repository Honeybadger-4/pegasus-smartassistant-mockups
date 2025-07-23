import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

import { SystemPropertyService } from '@shared/services/system-property.service';
import { SystemPropertyAdminService } from '@shared/services/system-property-admin.service';

import { KeyStatsCardComponent } from 'src/app/components/dashboard/key-stats-card/key-stats-card.component';
import { FlightCountCardComponent } from 'src/app/components/dashboard/flight-count-card/flight-count-card.component';
import { GpsSignalLossCardComponent } from 'src/app/components/dashboard/gps-signal-loss-card/gps-signal-loss-card.component';
import { TotalFuelOrderedCardComponent } from 'src/app/components/dashboard/total-fuel-ordered-card/total-fuel-ordered-card.component';
import { TopAlternateRoutesCardComponent } from 'src/app/components/dashboard/top-alternate-routes-card/top-alternate-routes-card.component';
import { map } from 'rxjs';

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
    GpsSignalLossCardComponent,
    TopAlternateRoutesCardComponent,
    KeyStatsCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService],
})
export class DashboardComponent implements OnInit {
  // signals
  selectedRange = signal<DateRangeType>('6months');
  fallbackEnabled = signal<boolean>(false);
  switchLoading = signal<boolean>(false);

  // services
  private sysPropSrv = inject(SystemPropertyService);
  private sysPropAdminSrv = inject(SystemPropertyAdminService);
  private msg = inject(MessageService);

  ngOnInit(): void {
    this.loadSwitch();
  }

  private loadSwitch() {
    this.switchLoading.set(true);
    this.sysPropSrv.getSystemLevelSwitch().subscribe({
      next: (val) => this.fallbackEnabled.set(val),
      error: () =>
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Switch value could not be loaded',
        }),
      complete: () => this.switchLoading.set(false),
    });
  }

  onToggleChange(val: boolean) {
    this.switchLoading.set(true);
    this.sysPropAdminSrv.updateSystemLevelSwitch(val ? 'ON' : 'OFF').subscribe({
      next: () =>
        this.msg.add({
          severity: 'success',
          summary: 'Saved',
          detail: `Fallback ${val ? 'ON' : 'OFF'}`,
        }),
      error: () => {
        this.fallbackEnabled.set(!val); // revert
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Save failed',
        });
      },
      complete: () => this.switchLoading.set(false),
    });
  }

  selectRange(range: DateRangeType) {
    this.selectedRange.set(range);
  }
}
