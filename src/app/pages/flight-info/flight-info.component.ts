import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TableModule,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Column } from '@shared/models/columns';
import { TabsModule } from 'primeng/tabs';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';

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
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
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

  dateRange: Date[] = [];
  filterFormGroup!: FormGroup;

  // Columns Variable
  mainCols!: Column[];
  crewCols!: Column[];
  flightPlanCols!: Column[];
  tripInfoCols!: Column[];
  loadSheetCols!: Column[];
  // /Columns Variable

  tableSubPanels!: any[];
  expandedRows = {};
  activeTabIndex = 0;

  // Mock Data
  flightsData = [
    {
      id: '0',
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      depPort: 'AYT',
      arrPort: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      user: 'SAWBNCS1',
      flightPlan: 'OK',
      altRoute: 'LGHB',
      fuelOrder: '9999 Kg',
      loadSheet: 'X',
      tripInfo: 'X',
    },
    {
      id: '1',
      aircraft: 'TC-A330',
      flightNo: 'PC2009',
      depPort: 'AYT',
      arrPort: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      user: 'SAWBNCS1',
      flightPlan: 'OK',
      altRoute: '-',
      fuelOrder: '9999 Kg',
      loadSheet: 'X',
      tripInfo: 'X',
    },
    {
      id: '2',
      aircraft: 'TC-A330',
      flightNo: 'PC2009',
      depPort: 'AYT',
      arrPort: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      user: 'SAWBNCS1',
      flightPlan: 'OK',
      altRoute: '-',
      fuelOrder: '9999 Kg',
      loadSheet: 'X',
      tripInfo: 'X',
    },
    {
      id: '3',
      aircraft: 'TC-A330',
      flightNo: 'PC2009',
      depPort: 'AYT',
      arrPort: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      user: 'SAWBNCS1',
      flightPlan: 'OK',
      altRoute: '-',
      fuelOrder: '9999 Kg',
      loadSheet: 'X',
      tripInfo: 'X',
    },
    {
      id: '4',
      aircraft: 'TC-A330',
      flightNo: 'PC2009',
      depPort: 'AYT',
      arrPort: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      user: 'SAWBNCS1',
      flightPlan: 'OK',
      altRoute: '-',
      fuelOrder: '9999 Kg',
      loadSheet: 'X',
      tripInfo: 'X',
    },
    {
      id: '5',
      aircraft: 'TC-A330',
      flightNo: 'PC2009',
      depPort: 'AYT',
      arrPort: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      user: 'SAWBNCS1',
      flightPlan: 'OK',
      altRoute: '-',
      fuelOrder: '9999 Kg',
      loadSheet: 'X',
      tripInfo: 'X',
    },
    {
      id: '6',
      aircraft: 'TC-A330',
      flightNo: 'PC2009',
      depPort: 'AYT',
      arrPort: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      user: 'SAWBNCS1',
      flightPlan: 'OK',
      altRoute: '-',
      fuelOrder: '9999 Kg',
      loadSheet: 'X',
      tripInfo: 'X',
    },
  ];
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
      crewVersion: '2/4',
      pantryCode: 'Domestic',
      taxiFuel: '999.999',
      tripFuel: '999.999',
      takeOffTime: '13:30',
      eet: '00:35',
      eicAdj: 'X',
      pax: '186Y',
      tripInfo: '-',
    },
    {
      sendBy: 'SAWBNCS02',
      crewVersion: '2/4',
      pantryCode: 'Domestic',
      taxiFuel: '999.999',
      tripFuel: '999.999',
      takeOffTime: '13:30',
      eet: '00:35',
      eicAdj: 'X',
      pax: '186Y',
      tripInfo: '-',
    },
    {
      sendBy: 'SAWBNCS02',
      crewVersion: '2/4',
      pantryCode: 'Domestic',
      taxiFuel: '999.999',
      tripFuel: '999.999',
      takeOffTime: '13:30',
      eet: '00:35',
      eicAdj: 'X',
      pax: '186Y',
      tripInfo: '-',
    },
    {
      sendBy: 'SAWBNCS02',
      crewVersion: '2/4',
      pantryCode: 'Domestic',
      taxiFuel: '999.999',
      tripFuel: '999.999',
      takeOffTime: '13:30',
      eet: '00:35',
      eicAdj: 'X',
      pax: '186Y',
      tripInfo: '-',
    },
    {
      sendBy: 'SAWBNCS02',
      crewVersion: '2/4',
      pantryCode: 'Domestic',
      taxiFuel: '999.999',
      tripFuel: '999.999',
      takeOffTime: '13:30',
      eet: '00:35',
      eicAdj: 'X',
      pax: '186Y',
      tripInfo: '-',
    },
    {
      sendBy: 'SAWBNCS02',
      crewVersion: '2/4',
      pantryCode: 'Domestic',
      taxiFuel: '999.999',
      tripFuel: '999.999',
      takeOffTime: '13:30',
      eet: '00:35',
      eicAdj: 'X',
      pax: '186Y',
      tripInfo: '-',
    },
    {
      sendBy: 'SAWBNCS02',
      crewVersion: '2/4',
      pantryCode: 'Domestic',
      taxiFuel: '999.999',
      tripFuel: '999.999',
      takeOffTime: '13:30',
      eet: '00:35',
      eicAdj: 'X',
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
      crew: '2/4',
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
      crew: '2/4',
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
      crew: '2/4',
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
      crew: '2/4',
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
      crew: '2/4',
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
      crew: '2/4',
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
      crew: '2/4',
      loadSheet: '-',
      cgLimits: '-',
    },
  ];
  // /Mock Data

  ngOnInit() {
    this.defineMainColumns();
    this.defineCrewColumns();
    this.defineFlightPlanColums();
    this.defineTripInfoColums();
    this.defineLoadSheetColums();
    this.activeTabIndexChange(0);
    this.defineTableSubPanels();
  }

  // Define Columns Operation
  defineMainColumns() {
    this.mainCols = [
      { field: 'aircraft', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'depPort', header: 'Dep Port' },
      { field: 'arrPort', header: 'Arr Port' },
      { field: 'depDateTime', header: 'Dep Date/Time' },
      { field: 'arrDateTime', header: 'Arr Date/Time' },
      { field: 'user', header: 'User' },
      { field: 'flightPlan', header: 'Flight Plan' },
      { field: 'altRoute', header: 'Alt Route' },
      { field: 'fuelOrder', header: 'Fuel Order' },
      { field: 'loadSheet', header: 'Load Sheet' },
      { field: 'tripInfo', header: 'Trip Info' },
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
      { field: 'crewVersion', header: 'Crew Version' },
      { field: 'pantryCode', header: 'Pantry Code' },
      { field: 'taxiFuel', header: 'Taxi Fuel' },
      { field: 'tripFuel', header: 'Trip Fuel' },
      { field: 'takeOffTime', header: 'Take Off Time' },
      { field: 'eet', header: 'EET' },
      { field: 'eicAdj', header: 'EIC Adj' },
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
      { field: 'crew', header: 'Crew' },
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

  onRowExpand(event: TableRowExpandEvent) {
    console.log('Expanded: ', event);
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    console.log('Collapsed: ', event);
  }

  activeTabIndexChange(value: number) {
    console.log('Tab changed: ', value);
  }

  onFilterSubmit() {
  }
}

