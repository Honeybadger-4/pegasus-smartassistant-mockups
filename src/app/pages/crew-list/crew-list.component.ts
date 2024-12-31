import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomDonutChartComponent } from '@shared/components/custom-donut-chart/custom-donut-chart.component';
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
import { PanelModule } from 'primeng/panel';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-logbook',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomBreadcrumbComponent,
    CustomDonutChartComponent,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    PanelModule,
  ],
  templateUrl: './crew-list.component.html',
  styleUrl: './crew-list.component.scss',
})
export class CrewListComponent {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;

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
  logbookDashboardData: any;
  crewListData = signal<ILogbookCrewListResponse | null>(null);
  crewListContentData = signal<ILogbookCrewListContentData[]>([]);

  chartDataOne: any;
  chartOptionsOne: any;
  chartDataTwo: any;
  chartOptionsTwo: any;

  // TODO: Logbook ekranından crew list ekranına yönlenildiğinde yerMonthValue parametresi logbook componentinden buraya gönderilmeli.
  yerMonthValue = '2024-11';

  ngOnInit() {
    this.logbookDashboardData = history.state.data;
    console.log(this.logbookDashboardData);

    this.defineColumns();
    this.defineChartDataAndOptions();
    this.getCrewList();
    this.setupSearchListener();
  }

  // Define Operations
  defineColumns() {
    this.columns = [
      { field: 'crewNameSurname', header: 'Crew Name & Surname' },
      { field: 'companyId', header: 'Company ID' },
      { field: 'totalNumberOfLog', header: 'Total Number of Log' },
      { field: 'flightLog', header: 'Flight Log' },
      { field: 'simulatorFlightLogs', header: 'Simulator Flight Logs' },
      { field: 'approvedLogs', header: 'Approved Logs' },
      { field: 'reassignedLogs', header: 'Reassing Logs' },
    ];
  }

  defineChartDataAndOptions() {
    this.chartDataOne = {
      datasets: [
        {
          data: [300, 50],
          backgroundColor: ['#5E548E', '#9F86C0'],
          hoverBackgroundColor: ['#5E548E', '#9F86C0'],
        },
      ],
    };

    this.chartOptionsOne = {
      cutout: '65%',
    };

    this.chartDataTwo = {
      datasets: [
        {
          data: [300, 50],
          backgroundColor: ['#31572C', '#4F772D'],
          hoverBackgroundColor: ['#31572C', '#4F772D'],
        },
      ],
    };

    this.chartOptionsTwo = {
      cutout: '65%',
    };
  }

  getCrewList() {
    this.logbookService
      .getCrewList(
        this.yerMonthValue,
        this.currentPage,
        this.currentRows,
        this.searchInputValue,
      )
      .subscribe({
        next: (response) => {
          this.crewListData.set(response);
          this.crewListContentData.set(response.content);
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  // Search Operations
  setupSearchListener() {
    fromEvent<Event>(this.searchInput.nativeElement, 'input')
      .pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(300),
        distinctUntilChanged()
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
