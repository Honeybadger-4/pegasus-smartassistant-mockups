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
import { FlightInformationService } from '@shared/services/flight-info-services/flight-information.service';
import { Column } from '@shared/models/columns';
import {
  IFlightInformationResponse,
  IFlightInformationTableData,
} from '@shared/models/flight-info-response-models/flight-information-response.model';

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
    FormsModule,
  ],
  templateUrl: './flight-info.component.html',
  styleUrl: './flight-info.component.scss',
})
export class FlightInfoComponent {
  @ViewChild('flightPlanTableFlightPlanCellTemplate', { static: true })
  flightPlanTableFlightPlanCellTemplate!: TemplateRef<any>;
  @ViewChild('loadSheetTableLoadSheetCellTemplate', { static: true })
  loadSheetTableLoadSheetCellTemplate!: TemplateRef<any>;
  @ViewChild('loadSheetTableCGLimitsCellTemplate', { static: true })
  loadSheetTableCGLimitsCellTemplate!: TemplateRef<any>;
  @ViewChild('tripInfoTableTripInfoCellTemplate', { static: true })
  tripInfoTableTripInfoCellTemplate!: TemplateRef<any>;

  filterFormGroup!: FormGroup;
  mainCols!: Column[];
  crewCols!: Column[];
  flightPlanCols!: Column[];
  tripInfoCols!: Column[];
  loadSheetCols!: Column[];
  dateRange: Date[] = [];
  expandedRows = {};
  currentPage = 0;
  currentRows = 20;
  tableLoading: boolean = false;

  tableSubPanels!: any[];
  activeTabIndex = 0;

  flightInformationHistoryData = signal<IFlightInformationResponse | null>(
    null,
  );
  flightInformatioHistoryTableData = signal<IFlightInformationTableData[]>([]);

  formBuilder = inject(FormBuilder);
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
  tripInfoData = [
    {
      sendBy: 'SAWBNCS01',
      crew_version: '2/4',
      pantry_code: 'Domestic',
      taxi_fuel: '999.999',
      trip_fuel: '999.999',
      takeoff_time: '13:30',
      eet: '00:35',
      eic_adj: 'X',
      pax: '186Y',
      tripInfo: '-',
    },
    {
      sendBy: 'SAWBNCS02',
      crew_version: '2/4',
      pantry_code: 'Domestic',
      taxi_fuel: '999.999',
      trip_fuel: '999.999',
      takeoff_time: '13:30',
      eet: '00:35',
      eic_adj: 'X',
      pax: '186Y',
      tripInfo: '-',
    },
    {
      sendBy: 'SAWBNCS02',
      crew_version: '2/4',
      pantry_code: 'Domestic',
      taxi_fuel: '999.999',
      trip_fuel: '999.999',
      takeoff_time: '13:30',
      eet: '00:35',
      eic_adj: 'X',
      pax: '186Y',
      tripInfo: '-',
    },
    {
      sendBy: 'SAWBNCS02',
      crew_version: '2/4',
      pantry_code: 'Domestic',
      taxi_fuel: '999.999',
      trip_fuel: '999.999',
      takeoff_time: '13:30',
      eet: '00:35',
      eic_adj: 'X',
      pax: '186Y',
      tripInfo: '-',
    },
    {
      sendBy: 'SAWBNCS02',
      crew_version: '2/4',
      pantry_code: 'Domestic',
      taxi_fuel: '999.999',
      trip_fuel: '999.999',
      takeoff_time: '13:30',
      eet: '00:35',
      eic_adj: 'X',
      pax: '186Y',
      tripInfo: '-',
    },
    {
      sendBy: 'SAWBNCS02',
      crew_version: '2/4',
      pantry_code: 'Domestic',
      taxi_fuel: '999.999',
      trip_fuel: '999.999',
      takeoff_time: '13:30',
      eet: '00:35',
      eic_adj: 'X',
      pax: '186Y',
      tripInfo: '-',
    },
    {
      sendBy: 'SAWBNCS02',
      crew_version: '2/4',
      pantry_code: 'Domestic',
      taxi_fuel: '999.999',
      trip_fuel: '999.999',
      takeoff_time: '13:30',
      eet: '00:35',
      eic_adj: 'X',
      pax: '186Y',
      tripInfo: '-',
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

  ngOnInit() {
    this.builder();
    this.defineMainColumns();
    this.defineCrewColumns();
    this.defineFlightPlanColums();
    this.defineTripInfoColums();
    this.defineLoadSheetColums();
    this.activeTabIndexChange(0);
    this.defineTableSubPanels();
    this.getFlightInfo();
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
      { field: 'flightPlanStatus', header: 'Flight Plan' },
      { field: 'altRoute', header: 'Alt Route' },
      { field: 'fuelOrder', header: 'Fuel Order' },
      { field: 'loadSheetStatus', header: 'Load Sheet' },
      { field: 'isTripInfoSent', header: 'Trip Info' },
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
      { field: 'sendBy', header: 'Send By' },
      { field: 'crew_version', header: 'Crew Version' },
      { field: 'pantry_code', header: 'Pantry Code' },
      { field: 'taxi_fuel', header: 'Taxi Fuel' },
      { field: 'trip_fuel', header: 'Trip Fuel' },
      { field: 'takeoff_time', header: 'Take Off Time' },
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
        value: 2,
      },
      {
        panelHeader: 'Load Sheet',
        tableData: this.loadSheetData,
        tableColumns: this.loadSheetCols,
        value: 3,
      },
    ];
  }

  // API Calls Operations
  getFlightInfo() {
    this.tableLoading = true;

    const formValues = this.filterFormGroup.value;
    const flightNo = formValues.flightNo?.trim() || null;
    const depPort = formValues.depPort?.trim() || null;
    const arrPort = formValues.arrPort?.trim() || null;
    const username = formValues.username?.trim() || null;

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

    this.flightInformationService
      .getFlightInfo(
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
          this.flightInformationHistoryData.set(response);
          this.flightInformatioHistoryTableData.set(response.content);
          this.tableLoading = false;
        },
        error: () => {
          this.tableLoading = false;
        },
      });
  }
  // Filter Operations
  dateRangeDefaultValue() {
    const endDate = moment();
    const startDate = moment().subtract(3, 'days');

    return [startDate.toDate(), endDate.toDate()];
  }

  onFilterSubmit() {
    this.getFlightInfo();
  }

  onRowExpand(event: TableRowExpandEvent) {
    console.log('Expanded: ', event);
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    console.log('Collapsed: ', event);
  }

  activeTabIndexChange(value: number) {
    console.log('Tab changed: ', value);
  }
  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getFlightInfo();
  }
}
