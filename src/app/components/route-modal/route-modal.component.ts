import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IRouteDetailsResponse } from '@shared/models/route-details-modal-response.model';
import { FlightInfoRoutesService } from '@shared/services/bff/route-details.service';
import { IFlightPlan } from '@shared/models/flight-plans-response.model';
import moment from 'moment';

@Component({
  selector: 'app-route-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, TableModule, ButtonModule],
  templateUrl: './route-modal.component.html',
  styleUrls: ['./route-modal.component.scss'],
})
export class RouteModalComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

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

  expandedRowsRoute: { [key: string]: boolean } = {};
  expandedRowsAlternate: { [key: string]: boolean } = {};

 
  ngOnInit(): void {}

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
            (routeItem) => routeItem.routeType === 'route',
          );
          const alternateList = formattedResponse.filter(
            (routeItem) => routeItem.routeType === 'alternate',
          );

          this.routeData.set(routeList);
          this.alternateRouteData.set(alternateList);
          this.tableLoading.set(false);

          this.expandedRowsRoute = {};
          this.expandedRowsAlternate = {};
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
