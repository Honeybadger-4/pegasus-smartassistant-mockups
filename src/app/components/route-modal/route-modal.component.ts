import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { IRouteDetailsResponse } from '@shared/models/route-details-modal-response.model';
import { FlightInfoRoutesService } from '@shared/services/bff/route-details.service';
import { IFlightPlan } from '@shared/models/flight-plans-response.model';
import moment from 'moment';

@Component({
  selector: 'app-route-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, CustomTableComponent],
  templateUrl: './route-modal.component.html',
  styleUrls: ['./route-modal.component.scss'],
})
export class RouteModalComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  noteStatusTemplate = viewChild.required('noteStatusTemplate');

  routeData = signal<IRouteDetailsResponse[]>([]);
  alternateRouteData = signal<IRouteDetailsResponse[]>([]);
  tableLoading = signal<boolean>(false);

  flightInfoRoutesService = inject(FlightInfoRoutesService);

  rowDataValue: IFlightPlan | null = null;
  @Input()
  set rowData(value: IFlightPlan | null) {
    this.rowDataValue = value;
    if (value) {
      this.getFlightInfoRoutes(value.id);
    }
  }
  get rowData(): IFlightPlan | null {
    return this.rowDataValue;
  }

  routeDetailsModalColumns: any[] = [];

  ngOnInit(): void {
    this.defineColumns();
  }

  defineColumns(): void {
    this.routeDetailsModalColumns = [
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
      {
        field: 'note',
        header: 'Notes',
        template: this.noteStatusTemplate(),
      },
    ];
  }

  getFlightInfoRoutes(flightPlanId: number): void {
  this.tableLoading.set(true);
  this.flightInfoRoutesService
    .getFlightInfoRoutes(flightPlanId.toString())
    .subscribe({
      next: (response) => {
        const formattedResponse = response.map((routeItem) => ({
          ...routeItem,
          sentDate: routeItem.sentDate
            ? moment(routeItem.sentDate).format('DD/MM/YYYY - HH:mm')
            : null,
        }));

        const routeList = formattedResponse.filter(
          (routeItem) => routeItem.routeType === 'route'
        );
        const alternateList = formattedResponse.filter(
          (routeItem) => routeItem.routeType === 'alternate'
        );

        this.routeData.set(routeList);
        this.alternateRouteData.set(alternateList);
        this.tableLoading.set(false);
      },
      error: () => {
        this.routeData.set([]);
        this.alternateRouteData.set([]);
        this.tableLoading.set(false);
      },
    });
}

  closeModal(): void {
    this.visibleChange.emit(false);
  }
}
