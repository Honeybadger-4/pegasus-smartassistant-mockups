import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';

import { RouteService } from '@shared/services/route.service';
import { Column } from '@shared/models/columns';
import {
  IRouteResponse,
  IRouteTableData,
} from '@shared/models/route-response.model';

import { FlightInfoRoutesService } from '@shared/services/route-details.service';
import {
  IRouteDetail,
  IRouteDetailResponse,
} from '@shared/models/ route-details-response.model';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import {
  TableModule,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import moment from 'moment';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    CommonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TableModule,
    ButtonModule,
    TabViewModule,
    CustomTableComponent,

    FormsModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss',
})
export class RouteComponent {
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;

  @ViewChild('expandableTableDocumentsIconTemplate', { static: true })
  expandableTableDocumentsIconTemplate!: TemplateRef<any>;

  formBuilder = inject(FormBuilder);
  routeService = inject(RouteService);
  flightInfoRoutesService = inject(FlightInfoRoutesService);

  filterFormGroup!: FormGroup;
  mainCols!: Column[];
  detailsCols!: Column[];
  dateRange: Date[] = [];
  expandedRows = {};
  currentPage = 0;
  currentRows = 20;
  tableLoading: boolean = false;

  routeHistoryData = signal<IRouteResponse | null>(null);
  routeHistoryTableData = signal<IRouteTableData[]>([]);

  routeDetailHistoryData = signal<IRouteDetailResponse | null>(null);
  routeDetailHistoryTableData = signal<IRouteDetail[]>([]);

  ngOnInit() {
    this.builder();
    this.defineMainColumns();
    this.defineDetailsColumns();
    this.getRoute();
  }

  builder() {
    this.filterFormGroup = this.formBuilder.group({
      flightNo: [''],
      depPort: [''],
      arrPort: [''],
      username: [''],
      dateRange: [this.dateRangeDefaultValue()],
    });
  }

  // Define Columns Operation
  defineMainColumns() {
    this.mainCols = [
      { field: 'aircraftReg', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'depPort', header: 'Dep Port' },
      { field: 'arrPort', header: 'Arr Port' },
      { field: 'depDateTime', header: 'Dep Date/Time' },
      { field: 'arrDateTime', header: 'Arr Date/Time' },
      { field: 'user', header: 'User' },
      { field: 'gpsLossForm', header: 'GPS Loss Form' },
      { field: 'alternateRoute', header: 'Alternate Route' },
    ];
  }
  defineDetailsColumns() {
    this.detailsCols = [
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
      { field: 'afDf', header: 'AF-DF' },
      { field: 'min', header: 'MIN' },
      { field: 'tw', header: 'T/W' },
      { field: 'atDt', header: 'AT-DT' },
      { field: 'acc', header: 'ACC' },
      {
        field: '',
        header: '',
        template: this.expandableTableDocumentsIconTemplate,
      },
    ];
  }

  getRoute() {
    this.tableLoading = true;

    const formValues = this.filterFormGroup.value;
    const username = formValues.username?.trim() || null;
    const flightNo = formValues.flightNo?.trim() || null;
    const depPort = formValues.depPort?.trim() || null;
    const arrPort = formValues.arrPort?.trim() || null;

    let startDate = '';
    let endDate = '';

    // Tarih aralığı kontrolü ve formatlama
    if (formValues.dateRange && formValues.dateRange.length === 2) {
      const [start, end] = formValues.dateRange;

      if (start && end) {
        startDate = moment(start).format('YYYY-MM-DD');
        endDate = moment(end).format('YYYY-MM-DD');
      }
    }

    this.routeService
      .getRoute(
        this.currentPage,
        this.currentRows,
        startDate,
        endDate,
        flightNo,
        depPort,
        arrPort,
        username,
      )
      .subscribe({
        next: (response) => {
          this.routeHistoryData.set(response);
          this.routeHistoryTableData.set(response.content);
          this.tableLoading = false;
        },
        error: () => {
          this.tableLoading = false;
        },
      });
  }

  getFlightInfoRoutes(flightPlanId: number) {
    this.tableLoading = true;
  
  
    this.flightInfoRoutesService.getFlightInfoRoutes(flightPlanId)
      .subscribe((response: IRouteDetailResponse) => {
        this.routeDetailHistoryData.set(response);
        this.routeDetailHistoryTableData.set(response.routes[0]);
        this.tableLoading = false;
      });
  }
  
  onFilterSubmit() {
    this.getRoute();
  }

  dateRangeDefaultValue() {
    const endDate = moment();
    const startDate = moment().subtract(3, 'days');

    return [startDate.toDate(), endDate.toDate()];
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getRoute();
  }

  onRowExpand(event: TableRowExpandEvent) {
    const flightPlanId = event.data.flightPlanId;
    
    this.flightInfoRoutesService.getFlightInfoRoutes(flightPlanId)
      .subscribe((response: IRouteDetailResponse) => {
        this.routeDetailHistoryData.set(response);
        this.routeDetailHistoryTableData.set(response.routes[0]);
        this.tableLoading = false;
      });
  }
  

  onRowCollapse(event: TableRowCollapseEvent) {
    console.log('Collapsed: ', event);
  }
}
