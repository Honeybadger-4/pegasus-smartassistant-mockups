import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomDonutChartComponent } from '@shared/components/custom-donut-chart/custom-donut-chart.component';
import { CustomBreadcrumbComponent } from '@shared/components/custom-breadcrumb/custom-breadcrumb.component';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { Column } from '@shared/models/columns';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PanelModule } from 'primeng/panel';
import { MenuItem } from 'primeng/api';
import { LogbookService } from '@shared/services/logbook.service';
import {
  ILogbookCrewListContentData,
  ILogbookCrewListResponse,
} from '@shared/models/logbook-crew-list-response.model';

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
  router = inject(Router);
  logbookService = inject(LogbookService);

  breadcrumbItems: MenuItem[] = [
    { label: 'Logbook', route: '/logbook' },
    { label: 'Crew List' },
  ];
  columns!: Column[];
  filterInput = '';
  logbookDashboardData: any;
  crewListData = signal<ILogbookCrewListResponse | null>(null);
  crewListContentData = signal<ILogbookCrewListContentData[]>([]);

  currentPage = 0;
  currentRows = 20;

  chartDataOne: any;
  chartOptionsOne: any;
  chartDataTwo: any;
  chartOptionsTwo: any;

  // Mock data
  yerMonthValue = '2024-11';

  ngOnInit() {
    this.logbookDashboardData = history.state.data;
    console.log(this.logbookDashboardData);

    this.defineColumns();
    this.defineChartDataAndOptions();
    this.getCrewList();
  }

  // Define values
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
        this.filterInput,
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
