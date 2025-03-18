import {
  Component,
  ElementRef,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

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
  // TODO: viewChild ile refactor edilmeli @ViewChild decaratörleri.
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  @ViewChild('linkedNextPageTemplate', { static: true })
  linkedNextPageTemplate!: TemplateRef<any>;
  @ViewChild('exportDataIconTemplate', { static: true })
  exportDataIconTemplate!: TemplateRef<any>;
  @ViewChild('totalHoursOfLogColumnTemplate', { static: true })
  totalHoursOfLogColumnTemplate!: TemplateRef<any>;
  @ViewChild('approvedStatusTemplate', { static: true })
  approvedStatusTemplate!: TemplateRef<any>;

  router = inject(Router);
  stateManagement = inject(StateManagement);
  pdfExportService = inject(PdfExportService);
  adminLogbookService = inject(AdminLogbookService);

  breadcrumbItems: MenuItem[] = [
    { label: 'Logbook', routerLink: '/logbook' },
    { label: 'Crew List' },
  ];
  searchInputValue = '';
  columns!: Column[];
  currentPage = 0;
  currentRows = 20;
  tableLoading: boolean = false;
  crewListData = signal<ILogbookCrewListResponse | ILogbookGetCrewListByFilterResponse | null>(null);
  crewListContentData = signal<ILogbookCrewListResponse['content']  | ILogbookGetCrewListByFilterResponse['content'] | null>(null);
  logbookDashboardData = signal<any>(null);
  isLogbookCurrentMonth = signal<boolean>(false);

  ngOnInit() {
    this.logbookDashboardData.set(
      this.stateManagement.getState('logbookSummaryPage'),
    );

    this.isLogbookCurrentMonth.set(
      this.stateManagement.getState('isLogbookCurrentMonth')
    );

    this.defineColumns();
    this.setupSearchListener();

    if(this.isLogbookCurrentMonth()) {
      this.getCrewListByFilterForCurrentMonth();
    }else {
      this.getCrewList();
    }
  }

  // Define Operations
  defineColumns() {
    if(this.isLogbookCurrentMonth()) {
      this.columns = [
        { field: 'fullName', header: 'Crew Name & Surname' },
        { field: 'companyId', header: 'Company ID' },
        { field: '', header: '', template: this.linkedNextPageTemplate },
      ];
    } else {
      this.columns = [
        { field: 'crewNameSurname', header: 'Crew Name & Surname' },
        { field: 'companyId', header: 'Company ID' },
        { field: 'totalNumberOfLog', header: 'Total Number of Log' },
        {
          field: 'totalHours',
          header: 'Total Hours of Log',
          template: this.totalHoursOfLogColumnTemplate,
        },
        { field: 'approvedLogs', header: 'Approved Logs' },
        { field: 'reassignedLogs', header: 'Reassing Logs' },
        {
          field: 'approvedStatus',
          header: 'Approval Status',
          template: this.approvedStatusTemplate,
        },
        { field: '', header: '', template: this.linkedNextPageTemplate },
        { field: '', header: '', template: this.exportDataIconTemplate },
      ];
    }
  }

  getCrewList() {
    this.tableLoading = true;
    this.adminLogbookService
      .getCrewList(
        this.logbookDashboardData()?.logbookType,
        this.logbookDashboardData()?.yearMonth,
        this.currentPage,
        this.currentRows,
        this.searchInputValue,
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.crewListData.set(response);
          this.crewListContentData.set(response.content);
          this.tableLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.tableLoading = false;
        },
      });
  }

  getCrewListByFilterForCurrentMonth() {
    this.tableLoading = true;
    this.adminLogbookService.getCrewListByFilterForCurrentMonth(
      this.currentPage,
      this.currentRows,
      this.searchInputValue
    ).subscribe({
      next: (response) => {
        this.crewListData.set(response);
        this.crewListContentData.set(response.content);
        this.tableLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.tableLoading = false;
      },
    })
  }

  // Download Pdf
  downloadPdf(rowData: any) {
    const companyId = rowData.companyId;
    const yearMonth = this.logbookDashboardData()?.yearMonth;

    this.pdfExportService.getPdfExport(companyId, yearMonth).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `Logbook_${companyId}_${yearMonth}.pdf`;
        link.click();
      },
      error: (error) => {
        console.error('PDF Download Error:', error);
      },
    });
  }

  // Search Operations
  setupSearchListener() {
    fromEvent<Event>(this.searchInput.nativeElement, 'input')
      .pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((searchText) => {
        if (searchText.trim() || searchText === '') {
          this.currentPage = 0;
          this.customTableComponent.resetTableFirstValue();

          if(this.isLogbookCurrentMonth()) {
            this.getCrewListByFilterForCurrentMonth();
          }else {
            this.getCrewList();
          }
        }
      });
  }

  onChangeSearch(value: string) {
    this.searchInputValue = value.toUpperCase();
  }

  // Table Operations
  tableRowSelected(event: any) {
    this.stateManagement.setState('crewListPage', event);
    this.router.navigate(['logbook/logbook-detail']);
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    
    if(this.isLogbookCurrentMonth()) {
      this.getCrewListByFilterForCurrentMonth();
    }else {
      this.getCrewList();
    }
  }
}
