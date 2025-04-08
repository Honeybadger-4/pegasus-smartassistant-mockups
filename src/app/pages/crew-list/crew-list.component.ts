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
import { FileSaverService } from '@shared/services/helpers-services/file-saver.service';
import { ILogbookCrewListResponse } from '@shared/models/logbook-crew-list-response.model';
import { StateManagement } from '@shared/services/helpers-services/state-management.service';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { CustomBreadcrumbComponent } from '@shared/components/custom-breadcrumb/custom-breadcrumb.component';

import { Chip } from 'primeng/chip';
import { MenuItem } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

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
    Chip
  ],
  templateUrl: './crew-list.component.html',
  styleUrl: './crew-list.component.scss',
})
export class CrewListComponent {
  constructor(private fileSaverService: FileSaverService) { }

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
  crewListData = signal<ILogbookCrewListResponse | null>(null);
  crewListContentData = signal<ILogbookCrewListResponse['content']| null>(null);
  searchInputValue = signal<string>('');

  logbookDashboardData: any = [];
  isLogbookCurrentMonth = false;
  breadcrumbItems: MenuItem[] = [
    { label: 'Logbook', routerLink: '/logbook' },
    { label: 'Crew List' },
  ];

  ngOnInit() {
    this.logbookDashboardData =
      this.stateManagement.getState('logbookSummaryPage');
    this.isLogbookCurrentMonth = this.stateManagement.getState(
      'isLogbookCurrentMonth',
    );

    this.defineColumns();
    this.setupSearchListener();
    this.getCrewList();
  }

  // Define Operations
  defineColumns() {
    if (this.isLogbookCurrentMonth) {
      this.columns.set([
        { field: 'crewNameSurname', header: 'Crew Name & Surname', isFilter: true },
        { field: 'companyId', header: 'Company ID', isFilter: true },
        { field: '', header: '', template: this.linkedNextPageTemplate() },
      ]);
    } else {
      this.columns.set([
        {
          field: 'crewNameSurname',
          header: 'Crew Name & Surname',
          isFilter: true,
        },
        { field: 'companyId', header: 'Company ID', isFilter: true },
        {
          field: 'totalNumberOfLog',
          header: 'Total Number of Log'
        },
        {
          field: 'totalHours',
          header: 'Total Hours of Log',
          template: this.totalHoursOfLogColumnTemplate()
        },
        { field: 'approvedLogs', header: 'Approved Logs' },
        { field: 'reassignedLogs', header: 'Reassing Logs' },
        {
          field: 'approvedStatus',
          header: 'Approval Status',
          template: this.approvedStatusTemplate(),
          isFilter: true,
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
        this.logbookDashboardData?.logbookType,
        this.logbookDashboardData?.yearMonth,
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
    const yearMonth = this.logbookDashboardData?.yearMonth;
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

          this.getCrewList();
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

  lazyLoadEvent(event: any) {
    const page = event.first / event.rows;
    this.currentPage.set(page);
    this.currentRows.set(event.rows);

    this.getCrewList();
  }
}
