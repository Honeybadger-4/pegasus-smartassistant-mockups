import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  fromEvent,
  map,
} from 'rxjs';

import { Column } from '@shared/models/columns';
import { PdfExportService } from '@shared/services/pdf-export.service';
import { AdminLogbookService } from '@shared/services/admin-logbook.service';
import { ILogbookCrewListResponse } from '@shared/models/logbook-crew-list-response.model';
import { StateManagement } from '@shared/services/helpers-services/state-management.service';
import { ILogbookGetCrewListByFilterResponse } from '@shared/models/get-crews-response.model';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { CustomBreadcrumbComponent } from '@shared/components/custom-breadcrumb/custom-breadcrumb.component';

import { MenuItem } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FileSaverService } from '@shared/services/helpers-services/file-saver.service';

@Component({
  selector: 'app-logbook',
  imports: [
    CommonModule,
    FormsModule,
    CustomBreadcrumbComponent,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SliderModule,
    PanelModule,
    TooltipModule,
    ButtonModule,
  ],
  templateUrl: './crew-list.component.html',
  styleUrl: './crew-list.component.scss',
})
export class CrewListComponent {
  constructor(private fileSaverService: FileSaverService) {}

  customTableComponent = viewChild.required(CustomTableComponent);
  searchInput = viewChild.required<ElementRef>('searchInput');
  linkedNextPageTemplate = viewChild.required('linkedNextPageTemplate');
  exportDataIconTemplate = viewChild.required('exportDataIconTemplate');
  approvedStatusTemplate = viewChild.required('approvedStatusTemplate');
  totalHoursOfLogColumnTemplate = viewChild.required(
    'totalHoursOfLogColumnTemplate',
  );

  router = inject(Router);
  stateManagement = inject(StateManagement);
  pdfExportService = inject(PdfExportService);
  adminLogbookService = inject(AdminLogbookService);

  columns = signal<Column[]>([]);
  currentPage = signal<number>(0);
  currentRows = signal<number>(20);
  tableLoading = signal<boolean>(false);
  crewListData = signal<
    ILogbookCrewListResponse | ILogbookGetCrewListByFilterResponse | null
  >(null);
  crewListContentData = signal<
    | ILogbookCrewListResponse['content']
    | ILogbookGetCrewListByFilterResponse['content']
    | null
  >(null);
  searchInputValue = signal<string>('');
  logbookDashboardData = signal<any>(null);
  isLogbookCurrentMonth = signal<boolean>(false);

  breadcrumbItems: MenuItem[] = [
    { label: 'Logbook', routerLink: '/logbook' },
    { label: 'Crew List' },
  ];

  ngOnInit() {
    this.logbookDashboardData.set(
      this.stateManagement.getState('logbookSummaryPage'),
    );

    this.isLogbookCurrentMonth.set(
      this.stateManagement.getState('isLogbookCurrentMonth'),
    );

    this.defineColumns();
    this.setupSearchListener();

    if (this.isLogbookCurrentMonth()) {
      this.getCrewListByFilterForCurrentMonth();
    } else {
      this.getCrewList();
    }
  }

  // Define Operations
  defineColumns() {
    if (this.isLogbookCurrentMonth()) {
      this.columns.set([
        { field: 'fullName', header: 'Crew Name & Surname' },
        { field: 'companyId', header: 'Company ID' },
        { field: '', header: '', template: this.linkedNextPageTemplate() },
      ]);
    } else {
      this.columns.set([
        { field: 'crewNameSurname', header: 'Crew Name & Surname' },
        { field: 'companyId', header: 'Company ID' },
        { field: 'totalNumberOfLog', header: 'Total Number of Log' },
        {
          field: 'totalHours',
          header: 'Total Hours of Log',
          template: this.totalHoursOfLogColumnTemplate(),
        },
        { field: 'approvedLogs', header: 'Approved Logs' },
        { field: 'reassignedLogs', header: 'Reassing Logs' },
        {
          field: 'approvedStatus',
          header: 'Approval Status',
          template: this.approvedStatusTemplate(),
        },
        { field: '', header: '', template: this.linkedNextPageTemplate() },
        { field: '', header: '', template: this.exportDataIconTemplate() },
      ]);
    }
  }

  getCrewList() {
    this.tableLoading.set(true);
    this.adminLogbookService
      .getCrewList(
        this.logbookDashboardData()?.logbookType,
        this.logbookDashboardData()?.yearMonth,
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
      )
      .subscribe({
        next: (response) => {
          this.crewListData.set(response);
          this.crewListContentData.set(response.content);
          this.tableLoading.set(false);
        },
        error: () => {
          this.tableLoading.set(false);
        },
      });
  }

  getCrewListByFilterForCurrentMonth() {
    this.tableLoading.set(true);
    this.adminLogbookService
      .getCrewListByFilterForCurrentMonth(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
      )
      .subscribe({
        next: (response) => {
          this.crewListData.set(response);
          this.crewListContentData.set(response.content);
          this.tableLoading.set(false);
        },
        error: () => {
          this.tableLoading.set(false);
        },
      });
  }

  async downloadPdf(rowData: any) {
    const companyId = rowData.companyId;
    const yearMonth = this.logbookDashboardData()?.yearMonth;
    try {
      const res = await firstValueFrom(
        this.pdfExportService.getPdfExport(companyId, yearMonth),
      );
      this.fileSaverService.getFileSaver(
        res,
        `Logbook_${companyId}_${yearMonth}.pdf`,
      );
    } catch (error) {
      console.error('PDF Download Error:', error);
    }
  }

  // Search Operations
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
          this.customTableComponent().resetTableFirstValue();

          if (this.isLogbookCurrentMonth()) {
            this.getCrewListByFilterForCurrentMonth();
          } else {
            this.getCrewList();
          }
        }
      });
  }

  onChangeSearch(value: string) {
    this.searchInputValue.set(value.toUpperCase());
  }

  // Table Operations
  navigateLogbookDetail(event: any) {
    this.stateManagement.setState('crewListPage', event);
    this.router.navigate(['logbook/logbook-detail']);
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage.set(page);
    this.currentRows.set(event.rows);

    if (this.isLogbookCurrentMonth()) {
      this.getCrewListByFilterForCurrentMonth();
    } else {
      this.getCrewList();
    }
  }
}
