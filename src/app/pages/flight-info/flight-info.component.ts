import {
  Component,
  effect,
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
import { IFlightInformationTripInfoResponse } from '@shared/models/flight-info-trip-info-response.model';
import { Chip } from 'primeng/chip';
import { SelectModule } from 'primeng/select';

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

  statusColumnTemplate = viewChild.required('statusColumnTemplate');

  mainCols!: Column[];
  crewCols!: Column[];
  flightPlanCols!: Column[];
  tripInfoCols!: Column[];
  loadSheetCols!: Column[];
  routeCols!: Column[];
  dateRange: Date[] = [];
  expandedRows: { [key: string]: boolean } = {};
  currentPage = 0;
  currentRows = 20;
  tableLoading = false;

  tableSubPanels!: any[];

  flightInformationHistoryData = signal<IFlightInformationResponse | null>(
    null,
  );
  flightInformatioHistoryTableData = signal<IFlightInformationTableData[]>([]);
  tripInfoData = signal<IFlightInformationTripInfoResponse[]>([]);
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
    this.getFlightInfo();
  }

  // Define Columns Operation
  defineMainColumns() {
    this.mainCols = [
      { field: 'aircraftReg', header: 'Aircraft', isFilter: true },
      { field: 'flightNo', header: 'Flight No', isFilter: true },
      { field: 'depPort', header: 'Dep Port', isFilter: true },
      { field: 'arrPort', header: 'Arr Port', isFilter: true },
      { field: 'depDateTime', header: 'Dep Date/Time' },
      { field: 'arrDateTime', header: 'Arr Date/Time' },

      { field: 'user', header: 'Responsible User', isFilter: true },

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
        tableData: this.tripInfoData(),
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
    this.tableLoading = true;
    const startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    this.flightInformationService
      .getFlightInfo(this.currentPage, this.currentRows, startDate, endDate)
      .subscribe({
        next: (response) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime?moment(item.depDateTime).format('DD/MM/YYYY - HH:mm'):'-',
            arrDateTime: item.arrDateTime?moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm'):'-',
          }));

          this.flightInformationHistoryData.set(response);
          this.flightInformatioHistoryTableData.set(formattedData);
          this.tableLoading = false;
        },
        error: () => {
          this.tableLoading = false;
        },
      });
  }

  getFlightInformationTripInfo(legIsn: number) {
    this.tripInfoDataLoading.set(true);
    this.flightInformationService
      .getFlightInformationTripInfo(legIsn)
      .subscribe({
        next: (response) => {
          this.tripInfoData.set(response);
          this.tripInfoDataLoading.set(false);
        },
        error: (error) => {
          console.log(error);
          this.tripInfoDataLoading.set(false);
        },
      });
  }

  onRowExpand(event: TableRowExpandEvent) {
    this.expandedRows = {};
    this.expandedRows[event.data.legIsn] = true;
    this.getFlightInformationTripInfo(event.data.legIsn);
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    delete this.expandedRows[event.data.legIsn];
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getFlightInfo();
  }

  onChangeSearch(value: string) {}

  filterDateControl(selectedDate: any) {
    return moment(selectedDate).format('YYYY-MM-DD');
  }
}
