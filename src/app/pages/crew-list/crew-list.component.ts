import {
  Component,
  ElementRef,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomBreadcrumbComponent } from '@shared/components/custom-breadcrumb/custom-breadcrumb.component';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { LogbookService } from '@shared/services/logbook.service';
import { Column } from '@shared/models/columns';
import {
  ILogbookCrewListContentData,
  ILogbookCrewListResponse,
} from '@shared/models/logbook-crew-list-response.model';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SliderModule } from 'primeng/slider';
import { PanelModule } from 'primeng/panel';
import { MenuItem } from 'primeng/api';
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
  ],
  templateUrl: './crew-list.component.html',
  styleUrl: './crew-list.component.scss',
})
export class CrewListComponent {
  @ViewChild('linkedNextPageTemplate', { static: true })
  linkedNextPageTemplate!: TemplateRef<any>;
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  router = inject(Router);
  logbookService = inject(LogbookService);

  breadcrumbItems: MenuItem[] = [
    { label: 'Logbook', route: '/logbook' },
    { label: 'Crew List' },
  ];
  searchInputValue = '';
  columns!: Column[];
  currentPage = 0;
  currentRows = 20;
  tableLoading: boolean = false;
  crewListData = signal<ILogbookCrewListResponse | null>(null);
  crewListContentData = signal<ILogbookCrewListContentData[]>([]);
  logbookDashboardData = signal<any>(null);

  ngOnInit() {
    this.logbookDashboardData.set(history.state.data);

    this.defineColumns();
    this.getCrewList();
    this.setupSearchListener();
  }

  // Define Operations
  defineColumns() {
    this.columns = [
      { field: 'crewNameSurname', header: 'Crew Name & Surname' },
      { field: 'companyId', header: 'Company ID' },
      { field: 'totalNumberOfLog', header: 'Total Number of Log' },
      ...(this.logbookDashboardData()?.logbookType !== 'TRAINING'
        ? [{ field: 'flightLog', header: 'Flight Log' }]
        : []),
      ...(this.logbookDashboardData()?.logbookType === 'TRAINING'
        ? [{ field: 'simulatorFlightLogs', header: 'Simulator Flight Logs' }]
        : []),
      { field: 'approvedLogs', header: 'Approved Logs' },
      { field: 'reassignedLogs', header: 'Reassing Logs' },
      { field: '', header: '', template: this.linkedNextPageTemplate },
    ];
  }

  getCrewList() {
    this.tableLoading = true;
    this.logbookService
      .getCrewList(
        this.logbookDashboardData()?.logbookType,
        this.logbookDashboardData()?.yearMonth,
        this.currentPage,
        this.currentRows,
        this.searchInputValue,
      )
      .subscribe({
        next: (response) => {
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
          this.getCrewList();
        }
      });
  }

  onChangeSearch(value: string) {
    this.searchInputValue = value.toUpperCase();
  }

  // Table Operations
  tableRowSelected(event: any) {
    this.router.navigate(['logbook/logbook-detail'], {
      state: { data: event },
    });
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getCrewList();
  }
}
