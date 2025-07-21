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
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

import { FlightPlansService } from '@shared/services/flight-plans.service';
import { IFlightPlan } from '@shared/models/flight-plans-response.model';
import { FlightPlanPdfService } from '@shared/services/flightPlan/flight-plan-pdf.service';
import { IFlightPlanModalPdfResponse } from '@shared/models/flight-plan-modal-pdf-response.model';
import { FlightPlanModalComponent } from '../../components/flight-plan-modal/flight-plan-modal.component';

import { TripInfoService } from '@shared/services/trip-info.service';
import {
  ITripInfoResponse,
  ITripInfoTableData,
} from '@shared/models/trip-info-response.model';
import { ITripInfoDetailsResponse } from '@shared/models/trip-info-details-response.model';
import { TripInfoDetailsModalComponent } from '../../components/trip-info-details-modal/trip-info-details-modal.component';

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
    ChipModule,
    SelectModule,
    FlightPlanModalComponent,
    TripInfoDetailsModalComponent,
  ],

  templateUrl: './flight-info.component.html',
  styleUrl: './flight-info.component.scss',
})
export class FlightInfoComponent implements OnInit {
  @ViewChild('loadSheetTableLoadSheetCellTemplate', { static: true })
  loadSheetTableLoadSheetCellTemplate!: TemplateRef<any>;
  @ViewChild('loadSheetTableCGLimitsCellTemplate', { static: true })
  loadSheetTableCGLimitsCellTemplate!: TemplateRef<any>;

  @ViewChild('routeTableDocumentsCellTemplate', { static: true })
  routeTableDocumentsCellTemplate!: TemplateRef<any>;
  @ViewChild('requiredActionsTemplate', { static: true })
  requiredActionsTemplate!: TemplateRef<any>;

  flightPlansColumnTemplate = viewChild.required('flightPlansColumnTemplate');

  customTableComponent = viewChild(CustomTableComponent);

  mainStatusColumnTemplate = viewChild.required('mainStatusColumnTemplate');

  flightPlanStatusColumnTemplate = viewChild.required(
    'flightPlanStatusColumnTemplate',
  );

  tripInfodetailsColumnTemplate = viewChild.required(
    'tripInfodetailsColumnTemplate',
  );
  showTripInfoDetailsModal = signal<boolean>(false);

  searchInput = viewChild.required<ElementRef>('searchInput');
  tableFilters = signal<any>({});

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
  flightPlanPdfService = inject(FlightPlanPdfService);

  flightPlanData = signal<IFlightPlan[]>([]);
  flightPlanLoading = signal<boolean>(false);
  displayModal = signal<boolean>(false);
  pdfData = signal<IFlightPlanModalPdfResponse | null>(null);

  // Mevcut servis inject’lerine ek olarak…
  flightPlansService = inject(FlightPlansService);

  flightInformationHistoryData = signal<IFlightInformationResponse | null>(
    null,
  );
  flightInformatioHistoryTableData = signal<IFlightInformationTableData[]>([]);
  searchInputValue = signal<string>('');

  flightInformationService = inject(FlightInformationService);
  tripInfoService = inject(TripInfoService);
  tripInfoDetails = signal<ITripInfoDetailsResponse | null>(null);

  tripInfoData = signal<ITripInfoTableData[]>([]);
  tripInfoDataLoading = signal<boolean>(false);

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
    this.defineFlightPlanColums();
    this.defineTripInfoColums();

    this.defineCrewColumns();
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
        filterType: 'selectbox',
        template: this.mainStatusColumnTemplate(),
        filterOptions: [
          { label: 'Waiting', value: 'WAITING' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'In Progress', value: 'IN_PROGRESS' },
        ],
      },

      {
        field: 'requiredActions',
        header: 'Required Actions',
        template: this.requiredActionsTemplate,
      },
    ];
  }

  defineFlightPlanColums() {
    this.flightPlanCols = [
      {
        field: 'receivedDateTime',
        header: 'Received Date',
      },
      { field: 'version', header: 'Version' },
      { field: 'responsibleUser', header: 'Responsible User' },
      {
        field: 'status',
        header: 'Status',
        template: this.flightPlanStatusColumnTemplate(),
      },
      {
        field: 'approvedDateTime',
        header: 'Approved Date',
      },
      {
        field: 'replacedDateTime',
        header: 'Replaced Date',
      },
      {
        field: 'declinedDateTime',
        header: 'Declined Date',
      },
      {
        field: 'submittedDateTime',
        header: 'Submitted Date',
      },
      {
        field: 'flightPlan',
        header: 'Flight Plan',
        isFilter: false,
        template: this.flightPlansColumnTemplate(),
      },
    ];
  }

  defineTripInfoColums() {
    this.tripInfoCols = [
      { field: 'sentBy', header: 'Sent By' },
      {
        field: 'sentDateTime',
        header: 'Sent Date',
      },
      {
        field: 'details',
        header: 'Details',
        isFilter: false,
        template: this.tripInfodetailsColumnTemplate(),
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
        panelHeader: 'Flight Plans',
        tableData: this.flightPlanData(),
        tableColumns: this.flightPlanCols,
        tableLoading: this.flightPlanLoading(),
        value: 0,
      },
      {
        panelHeader: 'Trip Infos',
        tableData: this.tripInfoData(), // artık dizi
        tableColumns: this.tripInfoCols,
        tableLoading: this.tripInfoDataLoading(), // loading sinyali
        value: 1,
      },
      {
        panelHeader: 'Crew',
        tableData: this.crewData,
        tableColumns: this.crewCols,
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
      depDateTime:
        event.filters?.depDateTime && event.filters?.depDateTime[0].value,
      arrPort: event.filters?.arrPort && event.filters?.arrPort[0].value,
      arrDateTime:
        event.filters?.arrDateTime && event.filters?.arrDateTime[0].value,
      responsibleUser:
        event.filters?.responsibleUser &&
        event.filters?.responsibleUser[0].value,
      status: event.filters?.status && event.filters?.status[0].value,
    };

    this.getFlightInfo();
  }

  // Mevcut onRowExpand’i şöyle güncelle:

  onRowExpand(event: TableRowExpandEvent) {
    this.expandedRows = {};
    this.expandedRows[event.data.legIsn] = true;

    // ← doğru isimler:
    const acReg = event.data.aircraftReg;
    const flightNo = event.data.flightNo;

    this.loadFlightPlans(acReg, flightNo);
    this.loadTripInfo(acReg, flightNo);
  }

  loadFlightPlans(acReg: string, flightNo: string) {
    this.flightPlanLoading.set(true);

    this.flightPlansService
      .getFlightPlans(
        this.currentPage(), // pagination
        this.currentRows(), // kaç satır gösterilecek
        this.searchInputValue(),
        this.tableFilters(),
      )
      .subscribe({
        next: (response) => {
          const formatted = response.content.map((item) => ({
            ...item,
            receivedDateTime: item.receivedDateTime
              ? moment(item.receivedDateTime).format('DD/MM/YYYY - HH:mm')
              : '-',
            approvedDateTime: item.approvedDateTime
              ? moment(item.approvedDateTime).format('DD/MM/YYYY - HH:mm')
              : '-',
            replacedDateTime: item.replacedDateTime
              ? moment(item.replacedDateTime).format('DD/MM/YYYY - HH:mm')
              : '-',
            declinedDateTime: item.declinedDateTime
              ? moment(item.declinedDateTime).format('DD/MM/YYYY - HH:mm')
              : '-',
            submittedDateTime: item.submittedDateTime
              ? moment(item.submittedDateTime).format('DD/MM/YYYY - HH:mm')
              : '-',
          }));

          this.flightPlanData.set(formatted);
          this.flightPlanLoading.set(false);
        },
        error: () => {
          this.flightPlanLoading.set(false);
        },
      });
  }

 loadTripInfo(acReg: string, flightNo: string) {
  this.tripInfoDataLoading.set(true);

  this.tripInfoService
    .getTripInfo(this.currentPage(), this.currentRows(), undefined, {
      acReg,
      flightNo,
    })
    .subscribe({
      next: (response) => {
        const formatted = response.content.map((item) => ({
          ...item,
          sentDateTime: item.sentDateTime
            ? moment(item.sentDateTime).format('DD/MM/YYYY - HH:mm')
            : '-',
        }));

        // <-- use the formatted array, not the raw response
        this.tripInfoData.set(formatted);
        this.tripInfoDataLoading.set(false);
      },
      error: () => {
        this.tripInfoDataLoading.set(false);
      },
    });
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

  onFlightPlansShow(row: IFlightPlan) {
    this.flightPlanPdfService.getPaperFPlan(row.id.toString()).subscribe({
      next: (pdf) => {
        this.pdfData.set(pdf);
        this.displayModal.set(true);
      },
    });
  }

  onModalHide() {
    this.displayModal.set(false);
  }

  onTripInfoDetailsShow(rowData: ITripInfoTableData) {
    this.tripInfoService.getTripInfoDetails(rowData.id).subscribe({
      next: (data) => {
        this.tripInfoDetails.set(data);
        this.showTripInfoDetailsModal.set(true);
      },
      error: (err) => {
        console.error('Trip Info Details fetch failed:', err);
      },
    });
  }

  get tripInfoDetailsModalVisible() {
    return this.showTripInfoDetailsModal();
  }
  set tripInfoDetailsModalVisible(val: boolean) {
    this.showTripInfoDetailsModal.set(val);
  }
}
