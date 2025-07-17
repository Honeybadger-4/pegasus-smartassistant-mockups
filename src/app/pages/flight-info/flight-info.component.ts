import {
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { FlightInformationService } from '@shared/services/flight-information.service';
import { Column } from '@shared/models/columns';
import {
  IFlightInformationResponse,
  IFlightInformationTableData,
} from '@shared/models/flight-information-response.model';

import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import {
  TableModule,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { DatePickerModule } from 'primeng/datepicker';
import moment from 'moment';
import { Chip } from 'primeng/chip';
import { SelectModule } from 'primeng/select';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-flight-info',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TabsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    Chip,
    SelectModule,
  ],

  templateUrl: './flight-info.component.html',
  styleUrl: './flight-info.component.scss',
})
export class FlightInfoComponent implements OnInit {
  @ViewChild('flightPlanTableFlightPlanCellTemplate', { static: true })
  flightPlanTableFlightPlanCellTemplate!: TemplateRef<any>;
  @ViewChild('loadSheetTableLoadSheetCellTemplate', { static: true })
  loadSheetTableLoadSheetCellTemplate!: TemplateRef<any>;
  @ViewChild('loadSheetTableCGLimitsCellTemplate', { static: true })
  loadSheetTableCGLimitsCellTemplate!: TemplateRef<any>;
  @ViewChild('tripInfoTableTripInfoCellTemplate', { static: true })
  tripInfoTableTripInfoCellTemplate!: TemplateRef<any>;
  @ViewChild('routeTableDocumentsCellTemplate', { static: true })
  routeTableDocumentsCellTemplate!: TemplateRef<any>;
  @ViewChild('requiredActionsTemplate', { static: true })
  requiredActionsTemplate!: TemplateRef<any>;
  
customTableComponent = viewChild(CustomTableComponent);

  statusColumnTemplate = viewChild.required('statusColumnTemplate');

  searchInput = viewChild.required<ElementRef>('searchInput');

  mainCols!: Column[];
  crewCols!: Column[];
  flightPlanCols!: Column[];
  tripInfoCols!: Column[];
  loadSheetCols!: Column[];
  routeCols!: Column[];
  dateRange: Date[] = [];
  expandedRows: { [key: string]: boolean } = {};
  currentPage = signal<number>(0);
  currentRows = signal<number>(20);
  tableLoading = signal<boolean>(false);
  filterValues: { [key: string]: any } = {};
  tableSubPanels!: any[];

  flightInformationHistoryData = signal<IFlightInformationResponse | null>(
    null,
  );
  flightInformatioHistoryTableData = signal<IFlightInformationTableData[]>([]);
  tripInfoDataLoading = signal<boolean>(false);
  searchInputValue = signal<string>('');

  flightInformationService = inject(FlightInformationService);

  crewData = [
    {
      name: 'Mert Inan',
      id: '123123123',
      leg: '-',
      duty: 'CAP',
      dustyStart: '00:10',
      additionalDutyTime: '00:20',
      pass: 'OK',
      pfPm: 'OK',
      pilotComment: 'Test 1',
    },
    {
      name: 'Mert Inan 2',
      id: '456456456456',
      leg: '-',
      duty: 'CAP',
      dustyStart: '00:10',
      additionalDutyTime: '00:20',
      pass: 'OK',
      pfPm: 'OK',
      pilotComment: 'Test 2',
    },
    {
      name: 'Mert Inan 2',
      id: '456456456456',
      leg: '-',
      duty: 'CAP',
      dustyStart: '00:10',
      additionalDutyTime: '00:20',
      pass: 'OK',
      pfPm: 'OK',
      pilotComment: 'Test 2',
    },
    {
      name: 'Mert Inan 2',
      id: '456456456456',
      leg: '-',
      duty: 'CAP',
      dustyStart: '00:10',
      additionalDutyTime: '00:20',
      pass: 'OK',
      pfPm: 'OK',
      pilotComment: 'Test 2',
    },
    {
      name: 'Mert Inan 2',
      id: '456456456456',
      leg: '-',
      duty: 'CAP',
      dustyStart: '00:10',
      additionalDutyTime: '00:20',
      pass: 'OK',
      pfPm: 'OK',
      pilotComment: 'Test 2',
    },
    {
      name: 'Mert Inan 2',
      id: '456456456456',
      leg: '-',
      duty: 'CAP',
      dustyStart: '00:10',
      additionalDutyTime: '00:20',
      pass: 'OK',
      pfPm: 'OK',
      pilotComment: 'Test 2',
    },
    {
      name: 'Mert Inan 2',
      id: '456456456456',
      leg: '-',
      duty: 'CAP',
      dustyStart: '00:10',
      additionalDutyTime: '00:20',
      pass: 'OK',
      pfPm: 'OK',
      pilotComment: 'Test 2',
    },
  ];
  flightPlanData = [
    {
      approvedBy: 'SAWBNCS1',
      msr: 'at LTAC',
      ver: 'OFP3',
      fuelOrder: '9999 Kg',
      altRoute: 'LTGH',
      gpsLossForm: 'Not Sent',
      flightPlan: '-',
    },
    {
      approvedBy: 'SAWBNCS2',
      msr: 'at LTAC',
      ver: 'OFP3',
      fuelOrder: '9999 Kg',
      altRoute: 'LTGH',
      gpsLossForm: 'Not Sent',
      flightPlan: '-',
    },
    {
      approvedBy: 'SAWBNCS3',
      msr: 'at LTAC',
      ver: 'OFP3',
      fuelOrder: '9999 Kg',
      altRoute: 'LTGH',
      gpsLossForm: 'Not Sent',
      flightPlan: '-',
    },
    {
      approvedBy: 'SAWBNCS3',
      msr: 'at LTAC',
      ver: 'OFP3',
      fuelOrder: '9999 Kg',
      altRoute: 'LTGH',
      gpsLossForm: 'Not Sent',
      flightPlan: '-',
    },
    {
      approvedBy: 'SAWBNCS3',
      msr: 'at LTAC',
      ver: 'OFP3',
      fuelOrder: '9999 Kg',
      altRoute: 'LTGH',
      gpsLossForm: 'Not Sent',
      flightPlan: '-',
    },
    {
      approvedBy: 'SAWBNCS3',
      msr: 'at LTAC',
      ver: 'OFP3',
      fuelOrder: '9999 Kg',
      altRoute: 'LTGH',
      gpsLossForm: 'Not Sent',
      flightPlan: '-',
    },
    {
      approvedBy: 'SAWBNCS3',
      msr: 'at LTAC',
      ver: 'OFP3',
      fuelOrder: '9999 Kg',
      altRoute: 'LTGH',
      gpsLossForm: 'Not Sent',
      flightPlan: '-',
    },
  ];

  loadSheetData = [
    {
      preparedBy: 'Lorem ipsum',
      checkedBy: 'Lorem ipsum',
      approvedBy: 'Lorem ipsum',
      lmc: 'X',
      acType: 'A320-251',
      version: '186Y',
      crewConfiguration: '2/4',
      loadSheet: '-',
      cgLimits: '-',
    },
    {
      preparedBy: 'Lorem ipsum 2',
      checkedBy: 'Lorem ipsum',
      approvedBy: 'Lorem ipsum',
      lmc: 'X',
      acType: 'A320-251',
      version: '186Y',
      crewConfiguration: '2/4',
      loadSheet: '-',
      cgLimits: '-',
    },
    {
      preparedBy: 'Lorem ipsum 2',
      checkedBy: 'Lorem ipsum',
      approvedBy: 'Lorem ipsum',
      lmc: 'X',
      acType: 'A320-251',
      version: '186Y',
      crewConfiguration: '2/4',
      loadSheet: '-',
      cgLimits: '-',
    },
    {
      preparedBy: 'Lorem ipsum 2',
      checkedBy: 'Lorem ipsum',
      approvedBy: 'Lorem ipsum',
      lmc: 'X',
      acType: 'A320-251',
      version: '186Y',
      crewConfiguration: '2/4',
      loadSheet: '-',
      cgLimits: '-',
    },
    {
      preparedBy: 'Lorem ipsum 2',
      checkedBy: 'Lorem ipsum',
      approvedBy: 'Lorem ipsum',
      lmc: 'X',
      acType: 'A320-251',
      version: '186Y',
      crewConfiguration: '2/4',
      loadSheet: '-',
      cgLimits: '-',
    },
    {
      preparedBy: 'Lorem ipsum 2',
      checkedBy: 'Lorem ipsum',
      approvedBy: 'Lorem ipsum',
      lmc: 'X',
      acType: 'A320-251',
      version: '186Y',
      crewConfiguration: '2/4',
      loadSheet: '-',
      cgLimits: '-',
    },
    {
      preparedBy: 'Lorem ipsum 2',
      checkedBy: 'Lorem ipsum',
      approvedBy: 'Lorem ipsum',
      lmc: 'X',
      acType: 'A320-251',
      version: '186Y',
      crewConfiguration: '2/4',
      loadSheet: '-',
      cgLimits: '-',
    },
  ];

  routeData = [
    {
      airway: 'UGB',
      wpt: 'GOBIT',
      mora: '86',
      fl: 'CLB',
      shr: '-',
      avtt: '110',
      wV: '269/02',
      dist: '54',
      rd: '152',
      pf: '152',
      fu: '-1042',
      rf: '-823',
      afDf: '00:00',
      min: '00:00',
      tW: '05:10',
      atDt: '00:00',
      acc: '05:10',
    },
    {
      airway: 'UGB',
      wpt: 'GOBIT',
      mora: '86',
      fl: 'CLB',
      shr: '-',
      avtt: '110',
      wV: '269/02',
      dist: '54',
      rd: '152',
      pf: '152',
      fu: '-1042',
      rf: '-823',
      afDf: '00:00',
      min: '00:00',
      tW: '05:10',
      atDt: '00:00',
      acc: '05:10',
    },
    {
      airway: 'UGB',
      wpt: 'GOBIT',
      mora: '86',
      fl: 'CLB',
      shr: '-',
      avtt: '110',
      wV: '269/02',
      dist: '54',
      rd: '152',
      pf: '152',
      fu: '-1042',
      rf: '-823',
      afDf: '00:00',
      min: '00:00',
      tW: '05:10',
      atDt: '00:00',
      acc: '05:10',
    },
    {
      airway: 'UGB',
      wpt: 'GOBIT',
      mora: '86',
      fl: 'CLB',
      shr: '-',
      avtt: '110',
      wV: '269/02',
      dist: '54',
      rd: '152',
      pf: '152',
      fu: '-1042',
      rf: '-823',
      afDf: '00:00',
      min: '00:00',
      tW: '05:10',
      atDt: '00:00',
      acc: '05:10',
    },
    {
      airway: 'UGB',
      wpt: 'GOBIT',
      mora: '86',
      fl: 'CLB',
      shr: '-',
      avtt: '110',
      wV: '269/02',
      dist: '54',
      rd: '152',
      pf: '152',
      fu: '-1042',
      rf: '-823',
      afDf: '00:00',
      min: '00:00',
      tW: '05:10',
      atDt: '00:00',
      acc: '05:10',
    },
    {
      airway: 'UGB',
      wpt: 'GOBIT',
      mora: '86',
      fl: 'CLB',
      shr: '-',
      avtt: '110',
      wV: '269/02',
      dist: '54',
      rd: '152',
      pf: '152',
      fu: '-1042',
      rf: '-823',
      afDf: '00:00',
      min: '00:00',
      tW: '05:10',
      atDt: '00:00',
      acc: '05:10',
    },
  ];

  tripInfoData = [{}];

  constructor() {
    effect(() => {
      this.defineTableSubPanels();
    });
  }

  ngOnInit() {
    this.defineMainColumns();
    this.defineCrewColumns();
    this.defineFlightPlanColums();
    this.defineTripInfoColums();
    this.defineLoadSheetColums();
    this.defineRouteColums();
    this.defineTableSubPanels();
    this.setupSearchListener();
  }

  // Define Columns Operation
  defineMainColumns() {
    this.mainCols = [
      { field: 'aircraftReg', header: 'Aircraft', isFilter: true },
      { field: 'flightNo', header: 'Flight No', isFilter: true },
      { field: 'depPort', header: 'Departure Port', isFilter: true },
      {
        field: 'depDateTime',
        header: 'Departure Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      { field: 'arrPort', header: 'Arrival Port', isFilter: true },
      {
        field: 'arrDateTime',
        header: 'Arrival Date',
        isFilter: true,
        filterType: 'datepicker',
      },

      { field: 'responsibleUser', header: 'Responsible User', isFilter: true },

      {
        field: 'status',
        header: 'Status',
        isFilter: true,
        filterOptions: [
          { label: 'Waiting', value: 'WAITING' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'In Progress', value: 'IN_PROGRESS' },
        ],
        filterType: 'selectbox',
        template: this.statusColumnTemplate(),
      },

      {
        field: 'requiredActions',
        header: 'Required Actions',
        template: this.requiredActionsTemplate,
      },
    ];
  }

  defineCrewColumns() {
    this.crewCols = [
      { field: 'name', header: 'Name' },
      { field: 'id', header: 'Id' },
      { field: 'leg', header: 'Leg' },
      { field: 'duty', header: 'Duty' },
      { field: 'dustyStart', header: 'Duty Start' },
      { field: 'additionalDutyTime', header: 'Additional Duty Time' },
      { field: 'pass', header: 'Pass' },
      { field: 'pfPm', header: 'PF/PM' },
      { field: 'pilotComment', header: 'Pilot Comment' },
    ];
  }

  defineFlightPlanColums() {
    this.flightPlanCols = [
      { field: 'approvedBy', header: 'Approved By' },
      { field: 'msr', header: 'MSR' },
      { field: 'ver', header: 'VER' },
      { field: 'fuelOrder', header: 'Fuel Order' },
      { field: 'altRoute', header: 'Alt. Route' },
      { field: 'gpsLossForm', header: 'GPS Loss Form' },
      {
        field: 'flightPlan',
        header: 'Flight Plan',
        template: this.flightPlanTableFlightPlanCellTemplate,
      },
    ];
  }

  defineTripInfoColums() {
    this.tripInfoCols = [
      { field: 'username', header: 'Send By' },
      { field: 'crewVersion', header: 'Crew Version' },
      { field: 'pantryCode', header: 'Pantry Code' },
      { field: 'taxiFuel', header: 'Taxi Fuel' },
      { field: 'tripFuel', header: 'Trip Fuel' },
      { field: 'takeOffTime', header: 'Take Off Time' },
      { field: 'eet', header: 'EET' },
      { field: 'eic_adj', header: 'EIC Adj' },
      { field: 'pax', header: 'Pax' },
      {
        field: 'tripInfo',
        header: 'Trip Info',
        template: this.tripInfoTableTripInfoCellTemplate,
      },
    ];
  }

  defineLoadSheetColums() {
    this.loadSheetCols = [
      { field: 'preparedBy', header: 'Prepared By' },
      { field: 'checkedBy', header: 'Checked By' },
      { field: 'approvedBy', header: 'Approved By' },
      { field: 'lmc', header: 'LMC' },
      { field: 'acType', header: 'A/C Type' },
      { field: 'version', header: 'Version' },
      { field: 'crewConfiguration', header: 'Crew' },
      {
        field: 'loadSheet',
        header: 'Load Sheet',
        template: this.loadSheetTableLoadSheetCellTemplate,
      },
      {
        field: 'cgLimits',
        header: 'CG Limits',
        template: this.loadSheetTableCGLimitsCellTemplate,
      },
    ];
  }

  defineRouteColums() {
    this.routeCols = [
      { field: 'airway', header: 'Airway' },
      { field: 'wpt', header: 'WPT' },
      { field: 'mora', header: 'MORA' },
      { field: 'fl', header: 'FL' },
      { field: 'shr', header: 'SHR' },
      { field: 'avtt', header: 'AVTT' },
      { field: 'wV', header: 'W/V' },
      { field: 'dist', header: 'DIST' },
      { field: 'rd', header: 'RD' },
      { field: 'pf', header: 'PF' },
      { field: 'fu', header: 'FU' },
      { field: 'rf', header: 'RF' },
      { field: 'afDf', header: 'AF-DF' },
      { field: 'min', header: 'MIN' },
      { field: 'tW', header: 'T/W' },
      { field: 'atDt', header: 'AT-DT' },
      { field: 'acc', header: 'ACC' },
      {
        field: '',
        header: '',
        template: this.routeTableDocumentsCellTemplate,
      },
    ];
  }

  defineTableSubPanels() {
    this.tableSubPanels = [
      {
        panelHeader: 'Crew',
        tableData: this.crewData,
        tableColumns: this.crewCols,
        value: 0,
      },
      {
        panelHeader: 'Flight Plan',
        tableData: this.flightPlanData,
        tableColumns: this.flightPlanCols,
        value: 1,
      },
      {
        panelHeader: 'Trip Info',
        tableData: this.tripInfoData,
        tableColumns: this.tripInfoCols,
        tableLoading: this.tripInfoDataLoading(),
        value: 2,
      },
      {
        panelHeader: 'Load Sheet',
        tableData: this.loadSheetData,
        tableColumns: this.loadSheetCols,
        value: 3,
      },
      {
        panelHeader: 'Route',
        tableData: this.routeData,
        tableColumns: this.routeCols,
        value: 4,
      },
    ];
  }

  // API Calls Operations
  getFlightInfo() {
    this.tableLoading.set(true);
    this.flightInformationService
      .getFlightInfo(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        this.filterValues,
      )
      .subscribe({
        next: (response) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
          }));

          this.flightInformationHistoryData.set(response);
          this.flightInformatioHistoryTableData.set(formattedData);
          this.tableLoading.set(false);
        },
        error: () => this.tableLoading.set(false),
      });
  }

  setupSearchListener() {
    fromEvent<Event>(this.searchInput().nativeElement, 'input')
      .pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((searchText) => {
        if (searchText.trim() || searchText === '') {
          this.currentPage.set(0);
      this.customTableComponent()?.resetTableFirstValue();

          this.getFlightInfo();
        }
      });
  }

  onLazyLoad(event: any) {
    this.updateFilters(event);
  }

  // Lazy Load tetiklendiğinde even.filters içerisinde boş olan filtreleri filterValues içinde resetler.
  updateFilters(event: any) {
    const filters = event.filters as { [key: string]: { value: any }[] };
    Object.entries(filters).forEach(([key, filterArray]) => {
      // PrimeNG filter yapısı: filterArray = [{ value, matchMode, operator }]
      const filterObj = filterArray[0];

      if (
        filterObj?.value == null ||
        filterObj?.value == undefined ||
        filterObj?.value == ''
      ) {
        this.filterValues[key] = filterObj.value;
      }
    });
  }

  lazyLoadEvent(event: any) {
    const page = event.first / event.rows;
    this.currentPage.set(page);
    this.currentRows.set(event.rows);

    this.filterValues = {
      aircraftReg:
        event.filters?.aircraftReg && event.filters?.aircraftReg[0].value,
      flightNo: event.filters?.flightNo && event.filters?.flightNo[0].value,
      depPort: event.filters?.depPort && event.filters?.depPort[0].value,
      depDate:
        event.filters?.depDateTime && event.filters?.depDateTime[0].value,
      arrPort: event.filters?.arrPort && event.filters?.arrPort[0].value,
      arrDate:
        event.filters?.arrDateTime && event.filters?.arrDateTime[0].value,
      responsibleUser: event.filters?.user && event.filters?.user[0].value,
      status: event.filters?.status && event.filters?.status[0].value,
    };

    this.getFlightInfo();
  }

  onRowExpand(event: TableRowExpandEvent) {
    this.expandedRows = {};
    this.expandedRows[event.data.legIsn] = true;
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    delete this.expandedRows[event.data.legIsn];
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage.set(page);
    this.currentRows.set(event.rows);
    this.getFlightInfo();
  }

  onChangeSearch(value: string) {
    this.searchInputValue.set(value.toUpperCase());
  }
  filterDateControl(selectedDate: any) {
    return moment(selectedDate).format('YYYY-MM-DD');
  }
}
