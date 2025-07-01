import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { IRouteDetailsResponse } from '@shared/models/route-details-modal-response.model';
import { FlightInfoRoutesService } from '@shared/services/bff/route-details.service';
import { IFlightPlan } from '@shared/models/flight-plans-response.model';
@Component({
  selector: 'app-route-modal',
  imports: [CommonModule, DialogModule, CustomTableComponent],
  templateUrl: './route-modal.component.html',
  styleUrl: './route-modal.component.scss',
})
export class RouteModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() rowData: IFlightPlan | null = null;

  routeDetailsModalData: IRouteDetailsResponse[] = [];


  routeDetailsModalColumns = [
    { field: 'airway', header: 'Airway' },
    { field: 'wpt', header: 'WPT' },
    { field: 'mora', header: 'MORA' },
    { field: 'fl', header: 'FL' },
    { field: 'shr', header: 'SHR' },
    { field: 'avtt', header: 'AVTT' },
    { field: 'wv', header: 'W/V' },
    { field: 'dist', header: 'DIST' },

    { field: 'rd', header: 'RD' },
    { field: 'pf', header: 'PF' },

    { field: 'fu', header: 'FU' },
    { field: 'rf', header: 'RF' },

    { field: 'af', header: 'AF' },
    { field: 'df', header: 'DF' },

    { field: 'min', header: 'MIN' },
    { field: 'tW', header: 'T/W' },

    { field: 'at', header: 'AT' },
    { field: 'dt', header: 'DT' },

    { field: 'acc', header: 'ACC' },

    { field: 'sentBy', header: 'Sent By' },

    { field: 'sentDate', header: 'Sent Date-Time' },

    { field: 'note', header: 'Notes' },
  ];

  flightInfoRoutesService = inject(FlightInfoRoutesService);

  ngOnChanges(changes: SimpleChanges) {
    // visible veya rowData değiştiğinde, yeni bir istek yap
    if (changes['rowData'] && this.rowData) {
      this.loadRouteDetails(this.rowData.id);
    }
  }

  private loadRouteDetails(flightPlanId: number) {
    this.flightInfoRoutesService
      .getFlightInfoRoutes(flightPlanId.toString())
      .subscribe({
        next: (data) => (this.routeDetailsModalData = data),
        error: (err) => console.error('Route details yüklenirken hata:', err),
      });
  }

  closeModal() {
    this.visibleChange.emit(false);
  }
}
