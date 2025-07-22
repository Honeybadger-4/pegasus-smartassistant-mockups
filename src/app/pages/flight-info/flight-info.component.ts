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
import { ILoadSheetResponse } from '@shared/models/load-sheet-response.model';

import { LoadSheetService } from '@shared/services/load-sheet.service';

import { ILoadSheetContentData } from '@shared/models/load-sheet-response.model';
import { CgLimitsService } from '@shared/services/bff/cg-limits.service';
import { GetCgLimitsResponseModel } from '@shared/models/cg-limits-response.model';
import { CgLimitsDialogComponent } from '../../components/cg-limits-dialog/cg-limits-dialog.component';
import { LoadAndTrimSheetComponent } from 'src/app/components/load-and-trim-sheet/load-and-trim-sheet.component';
import { LmcDetailsModalComponent } from 'src/app/components/lmc-details-modal/lmc-details-modal.component';
import { ILoadSheetModalsResponse } from '@shared/models/load-sheet-modals-response';
import { table } from 'console';
import { CrewInformationService } from '@shared/services/crew-information.service';
import { ICrewInformationContentData } from '@shared/models/crew-information-response.model';
import { FuelOrderService } from '@shared/services/fuel-order.service';
import { IFuelOrderContentData } from '@shared/models/fuel-order-response.model';
import { IReportsContentData } from '@shared/models/reports-response.model';

// imports üstüne ekle
import { ReportsService } from '@shared/services/reports.service';
import { ReportsModalComponent } from 'src/app/components/reports-modal/reports-modal.component';
// en üst importlara ekle
import { GpsSignalLossService } from '@shared/services/gps-signal-loss.service';
import { IGpsLossFormContentData } from '@shared/models/gps-loss-forms-response.model';
import { GpsLossFormsModalComponent } from 'src/app/components/gps-loss-forms-modal/gps-loss-forms-modal.component';
// mevcut importların yanına ekle
import { RouteModalComponent } from 'src/app/components/route-modal/route-modal.component';
import { IRouteDetailsResponse } from '@shared/models/route-details-modal-response.model';
import { FlightInfoRoutesService } from '@shared/services/bff/route-details.service';

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
    LoadAndTrimSheetComponent,
    CgLimitsDialogComponent,
    LmcDetailsModalComponent,
    ReportsModalComponent,
    GpsLossFormsModalComponent,
    RouteModalComponent,
  ],

  templateUrl: './flight-info.component.html',
  styleUrl: './flight-info.component.scss',
})
export class FlightInfoComponent implements OnInit {
  // FlightInfoComponent içinde
  @ViewChild('loadSheetColumnTemplate', { static: true })
  loadSheetColumnTemplate!: TemplateRef<any>;

  @ViewChild('cgLimitsColumnTemplate', { static: true })
  cgLimitsColumnTemplate!: TemplateRef<any>;

  @ViewChild('lmcColumnTemplate', { static: true })
  lmcColumnTemplate!: TemplateRef<any>;

  @ViewChild('routeTableDocumentsCellTemplate', { static: true })
  routeTableDocumentsCellTemplate!: TemplateRef<any>;
  @ViewChild('requiredActionsTemplate', { static: true })
  requiredActionsTemplate!: TemplateRef<any>;

  flightPlansColumnTemplate = viewChild.required('flightPlansColumnTemplate');
  // class içinde, diğer viewChild'ların yanına
  routeDetailsColumnTemplate = viewChild.required('routeDetailsColumnTemplate');

  // Data & loading
  routesTableData = signal<IFlightPlan[]>([]);
  routesTableLoading = signal<boolean>(false);

  // Modal kontrol
  showRouteDetailsModal = signal<boolean>(false);
  selectedRouteRow = signal<IFlightPlan | null>(null);

  customTableComponent = viewChild(CustomTableComponent);

  mainStatusColumnTemplate = viewChild.required('mainStatusColumnTemplate');

  loadSheetStatusTemplate = viewChild.required('loadSheetStatusTemplate');

  flightPlanStatusColumnTemplate = viewChild.required(
    'flightPlanStatusColumnTemplate',
  );

  @ViewChild('loadSheetLmcTemplate', { static: true })
  loadSheetLmcTemplate!: TemplateRef<any>;

  selectedLmcDetail = signal<ILoadSheetModalsResponse | null>(null);
  showLmcModal = signal<boolean>(false);

  loadSheetService = inject(LoadSheetService);

  tripInfodetailsColumnTemplate = viewChild.required(
    'tripInfodetailsColumnTemplate',
  );
  showTripInfoDetailsModal = signal<boolean>(false);
  reportsColumnTemplate = viewChild.required('reportsColumnTemplate');

  searchInput = viewChild.required<ElementRef>('searchInput');
  tableFilters = signal<any>({});

  mainCols!: Column[];
  crewCols!: Column[];
  fuelOrderCols!: Column[];
  reportsCols!: Column[];
  gpsLossFormsCols!: Column[];
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

  // class içinde sinyaller
  reportsService = inject(ReportsService);

  reportData = signal<IReportsContentData[]>([]);
  reportsLoading = signal<boolean>(false);

  showReportsModal = signal<boolean>(false);
  selectedReportRow = signal<IReportsContentData | null>(null);

  flightPlanData = signal<IFlightPlan[]>([]);
  flightPlanLoading = signal<boolean>(false);
  displayModal = signal<boolean>(false);
  pdfData = signal<IFlightPlanModalPdfResponse | null>(null);
  gpsLossFormsColumnTemplate = viewChild.required('gpsLossFormsColumnTemplate');

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
  crewInformationService = inject(CrewInformationService);

  tripInfoData = signal<ITripInfoTableData[]>([]);
  tripInfoDataLoading = signal<boolean>(false);

  crewData = signal<ICrewInformationContentData[]>([]);
  crewDataLoading = signal<boolean>(false);
  fuelOrderService = inject(FuelOrderService);

  // sayfanın başına, crewData signal’lerinin yanına
  fuelOrderData = signal<IFuelOrderContentData[]>([]);
  fuelOrderLoading = signal<boolean>(false);

  routeData = signal<ICrewInformationContentData[]>([]);
  routeDataLoading = signal<boolean>(false);

  loadSheetDataLoading = signal<boolean>(false);
  selectedLmcRowData = signal<ILoadSheetModalsResponse | null>(null);

  cgLimitsService = inject(CgLimitsService);

  loadSheetData = signal<ILoadSheetContentData[]>([]);
  loadSheetLoading = signal<boolean>(false);

  selectedLoadSheet = signal<ILoadSheetContentData | null>(null);
  showLoadSheetModal = signal<boolean>(false);

  selectedCgLimits = signal<GetCgLimitsResponseModel | null>(null);
  showCgLimitsDialog = signal<boolean>(false);

  // class içi
  gpsLossFormsService = inject(GpsSignalLossService);

  gpsLossFormsData = signal<IGpsLossFormContentData[]>([]);
  gpsLossFormsLoading = signal<boolean>(false);

  showGpsLossModal = signal<boolean>(false);
  selectedGpsLossRow = signal<IGpsLossFormContentData | null>(null);

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
    this.defineFuelOrderColums();
    this.defineReportsColums();
    this.defineGpsLossFormsColums();
    this.defineRoutesColumns();
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
  passStatusTemplate = viewChild.required('passStatusTemplate');

  defineLoadSheetColums() {
    this.loadSheetCols = [
      { field: 'version', header: 'Version' },
      { field: 'preparedBy', header: 'Prepared By' },
      { field: 'checkedBy', header: 'Checked By' },
      { field: 'responsibleUser', header: 'Responsible User' },
      {
        field: 'status',
        header: 'Status',
        template: this.loadSheetStatusTemplate(),
      },
      { field: 'approved', header: 'Approved Date' },
      { field: 'replaced', header: 'Replaced Date' },
      { field: 'declined', header: 'Declined Date' },
      {
        field: 'loadSheet',
        header: 'Load Sheet',
        template: this.loadSheetColumnTemplate,
      },
      {
        field: 'hasLmc',
        header: 'LMC',
        template: this.lmcColumnTemplate,
      },
      {
        field: 'cgLimits',
        header: 'CG Limits',
        template: this.cgLimitsColumnTemplate,
      },
    ];
  }
  defineCrewColumns() {
    this.crewCols = [
      { field: 'crewFullName', header: 'Name Surname' },
      { field: 'companyId', header: 'Company ID' },
      { field: 'leg', header: 'Leg' },
      { field: 'dutyType', header: 'Duty' },
      {
        field: 'dutyStart',
        header: 'Duty Start (GMT)',
      },

      {
        field: 'addDutyTime',
        header: 'Additional Duty Time',
      },
      {
        field: 'pass',
        header: ' Pass',
        template: this.passStatusTemplate(),
      },

      {
        field: 'pf',
        header: 'PF',
      },
      {
        field: 'pm',
        header: 'PM',
      },
      {
        field: 'decisionOfPilot',
        header: 'Decision of Pilot in Command',
      },
    ];
  }

  defineFuelOrderColums() {
    this.fuelOrderCols = [
      { field: 'amount', header: 'Amount' },
      { field: 'user', header: 'User' },
      {
        field: 'orderDateTime',
        header: 'Order Date',
      },
    ];
  }

  defineReportsColums() {
    this.reportsCols = [
      {
        field: 'createdBy',
        header: 'Sent By',
      },
      {
        field: 'enteredDate',
        header: 'Sent Date - Time',
      },
      {
        field: 'show',
        header: 'Report Details',
        template: this.reportsColumnTemplate(), // ↓ bu template’i html’de ekleyeceğiz
      },
    ];
  }

  defineGpsLossFormsColums() {
    this.gpsLossFormsCols = [
      { field: 'acReg', header: 'Ac Reg' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'depPort', header: 'Departure Port' },
      { field: 'depDateTime', header: 'Departure Date' },
      { field: 'arrPort', header: 'Arrival Port' },
      { field: 'arrDateTime', header: 'Arrival Date' },
      { field: 'firstPointName', header: 'First Point' },
      { field: 'lastPointName', header: 'Last Point' },
      { field: 'time', header: 'Time' },
      { field: 'flightPhase', header: 'Phase of Flight' },
      { field: 'flightLevel', header: 'Flight Level / Altitude' },
      { field: 'duration', header: 'Duration' },
      {
        field: 'gpsLossTypes',
        header: 'GPS Loss Types',
        template: this.gpsLossFormsColumnTemplate(),
      },
    ];
  }
  defineRoutesColumns() {
    this.routeCols = [
      { field: 'acReg', header: 'Ac Reg' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'depPort', header: 'Departure Port' },
      { field: 'depDateTime', header: 'Departure Date' },
      { field: 'arrPort', header: 'Arrival Port' },
      { field: 'arrDateTime', header: 'Arrival Date' },
      {
        field: 'routeDetails',
        header: 'Route Details',
        template: this.routeDetailsColumnTemplate(),
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
        panelHeader: 'Load Sheets',
        tableData: this.loadSheetData(),
        tableColumns: this.loadSheetCols,
        tableLoading: this.loadSheetLoading(),
        value: 2,
      },
      {
        panelHeader: 'Crews',
        tableData: this.crewData(),
        tableColumns: this.crewCols,
        tableLoading: this.crewDataLoading(),
        value: 3,
      },

      {
        panelHeader: 'Fuel Order',
        tableData: this.fuelOrderData(),
        tableColumns: this.fuelOrderCols,
        tableLoading: this.fuelOrderLoading(),
        value: 4,
      },
      {
        panelHeader: 'Reports',
        tableData: this.reportData(),
        tableColumns: this.reportsCols,
        tableLoading: this.reportsLoading(),
        value: 5,
      },
      {
        panelHeader: 'GPS Loss Forms',
        tableData: this.gpsLossFormsData(),
        tableColumns: this.gpsLossFormsCols,
        tableLoading: this.gpsLossFormsLoading(),
        value: 6,
      },
      {
        panelHeader: 'Routes',
        tableData: this.routesTableData(),
        tableColumns: this.routeCols,
        tableLoading: this.routesTableLoading(),
        value: 7,
      },
    ];
  }

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

  onRowExpand(event: TableRowExpandEvent) {
    this.expandedRows = {};
    this.expandedRows[event.data.legIsn] = true;

    const acReg = event.data.aircraftReg;
    const flightNo = event.data.flightNo;

    this.loadFlightPlans(acReg, flightNo);
    this.loadTripInfo(acReg, flightNo);
    this.loadLoadSheets(acReg, flightNo);
    this.loadCrew(acReg, flightNo);
    this.loadFuelOrder(acReg, flightNo);
    this.loadReports(acReg, flightNo);
    this.loadGpsLossForms(acReg, flightNo);
    this.loadRoutes(acReg, flightNo);
  }

  loadRoutes(acReg: string, flightNo: string) {
    this.routesTableLoading.set(true);

    this.flightPlansService
      .getFlightPlans(this.currentPage(), this.currentRows(), undefined, {
        acReg,
        flightNo,
      })
      .subscribe({
        next: (resp) => {
          const formatted = resp.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
          }));
          this.routesTableData.set(formatted);
          this.routesTableLoading.set(false);
        },
        error: () => this.routesTableLoading.set(false),
      });
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

  loadLoadSheets(acReg: string, flightNo: string) {
    this.loadSheetLoading.set(true);

    this.loadSheetService
      .getAllLoadSheet(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        { acReg, flightNo },
      )
      .subscribe({
        next: (response) => {
          const formatted = response.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            approved: item.approved
              ? moment(item.approved).format('DD/MM/YYYY - HH:mm')
              : null,
            replaced: item.replaced
              ? moment(item.replaced).format('DD/MM/YYYY - HH:mm')
              : null,
            declined: item.declined
              ? moment(item.declined).format('DD/MM/YYYY - HH:mm')
              : null,
          })) as ILoadSheetContentData[];

          this.loadSheetData.set(formatted);
          this.loadSheetLoading.set(false);
        },
        error: () => this.loadSheetLoading.set(false),
      });
  }
  loadCrew(acReg: string, flightNo: string) {
    this.crewDataLoading.set(true);

    this.crewInformationService
      .getAllCrewInformation(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        { acReg, flightNo },
      )
      .subscribe({
        next: (resp) => {
          const formatted = resp.content.map((item) => ({
            ...item,
            // dutyStart tarihini "DD/MM/YYYY - HH:mm" formatına çeviriyoruz
            dutyStart: item.dutyStart
              ? moment(item.dutyStart).format('DD/MM/YYYY - HH:mm')
              : null,
          }));
          this.crewData.set(formatted);
          this.crewDataLoading.set(false);
        },
        error: () => {
          this.crewDataLoading.set(false);
        },
      });
  }
  loadFuelOrder(acReg: string, flightNo: string) {
    this.fuelOrderLoading.set(true);

    this.fuelOrderService
      .getAllFuelOrder(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        { acReg, flightNo },
      )
      .subscribe({
        next: (resp) => {
          const formatted = resp.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            orderDateTime: item.orderDateTime
              ? moment(item.orderDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
          }));
          this.fuelOrderData.set(formatted);
          this.fuelOrderLoading.set(false);
        },
        error: () => this.fuelOrderLoading.set(false),
      });
  }
  loadReports(acReg: string, flightNo: string) {
    this.reportsLoading.set(true);

    this.reportsService
      .getAllReports(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        { acReg, flightNo },
      )
      .subscribe({
        next: (resp) => {
          const formatted = resp.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            enteredDate: item.enteredDate
              ? moment(item.enteredDate).format('DD/MM/YYYY - HH:mm')
              : null,
            doorClosed: item.doorClosed
              ? moment(item.doorClosed).format('DD/MM/YYYY - HH:mm')
              : null,
            offBlock: item.offBlock
              ? moment(item.offBlock).format('DD/MM/YYYY - HH:mm')
              : null,
            takeOff: item.takeOff
              ? moment(item.takeOff).format('DD/MM/YYYY - HH:mm')
              : null,
            landing: item.landing
              ? moment(item.landing).format('DD/MM/YYYY - HH:mm')
              : null,
            onBlock: item.onBlock
              ? moment(item.onBlock).format('DD/MM/YYYY - HH:mm')
              : null,
            doorOpen: item.doorOpen
              ? moment(item.doorOpen).format('DD/MM/YYYY - HH:mm')
              : null,
          }));
          this.reportData.set(formatted);
          this.reportsLoading.set(false);
        },
        error: () => this.reportsLoading.set(false),
      });
  }

  loadGpsLossForms(acReg: string, flightNo: string) {
    this.gpsLossFormsLoading.set(true);

    this.gpsLossFormsService
      .getAllGpsLossForms(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        { acReg, flightNo } as any, // servis aynı patterni kullanıyorsa
      )
      .subscribe({
        next: (resp) => {
          const formatted = resp.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
          }));
          this.gpsLossFormsData.set(formatted);
          this.gpsLossFormsLoading.set(false);
        },
        error: () => this.gpsLossFormsLoading.set(false),
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

  cgLimitsDialogVisible = signal<boolean>(false);

  onLoadSheetShow(row: ILoadSheetContentData) {
    this.selectedLoadSheet.set(row);
    this.showLoadSheetModal.set(true);
  }
  onShowCGLimitsDialog(row: ILoadSheetContentData) {
    this.selectedLoadSheet.set(row);
    this.showCgLimitsDialog.set(true);
  }

  get loadSheetModalVisible() {
    return this.showLoadSheetModal();
  }
  set loadSheetModalVisible(v: boolean) {
    this.showLoadSheetModal.set(v);
  }

  onLmcShow(row: ILoadSheetContentData) {
    this.loadSheetService.getLoadSheetModalInfo(row.id!).subscribe({
      next: (detail: ILoadSheetModalsResponse) => {
        this.selectedLmcRowData.set(detail);
        this.showLmcModal.set(true);
      },
    });
  }

  get lmcModalVisible() {
    return this.showLmcModal();
  }
  set lmcModalVisible(v: boolean) {
    this.showLmcModal.set(v);
  }

  onReportShow(row: IReportsContentData) {
    this.selectedReportRow.set(row);
    this.showReportsModal.set(true);
  }

  get reportsModalVisible() {
    return this.showReportsModal();
  }
  set reportsModalVisible(v: boolean) {
    this.showReportsModal.set(v);
  }

  onGpsLossShow(row: IGpsLossFormContentData) {
    this.selectedGpsLossRow.set(row);
    this.showGpsLossModal.set(true);
  }

  get gpsLossModalVisible() {
    return this.showGpsLossModal();
  }
  set gpsLossModalVisible(v: boolean) {
    this.showGpsLossModal.set(v);
  }

  onRouteDetailsShow(row: IFlightPlan) {
    this.selectedRouteRow.set(row);
    this.showRouteDetailsModal.set(true);
  }

  get routeDetailsModalVisible() {
    return this.showRouteDetailsModal();
  }
  set routeDetailsModalVisible(v: boolean) {
    this.showRouteDetailsModal.set(v);
  }
}
