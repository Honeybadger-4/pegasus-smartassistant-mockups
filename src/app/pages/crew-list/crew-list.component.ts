import { Component, inject } from '@angular/core';
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

  breadcrumbItems!: MenuItem[];
  columns!: Column[];
  filterInput = '';
  logbookDashboardData: any;

  chartDataOne: any;
  chartOptionsOne: any;
  chartDataTwo: any;
  chartOptionsTwo: any;

  logbookData = [
    {
      id: '0',
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      totalNumberofLog: '100',
      flightLog: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
    },
    {
      id: '1',
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      totalNumberofLog: '100',
      flightLog: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
    },
    {
      id: '2',
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      totalNumberofLog: '100',
      flightLog: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
    },
    {
      id: '3',
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      totalNumberofLog: '100',
      flightLog: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
    },
    {
      id: '4',
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      totalNumberofLog: '100',
      flightLog: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
    },
    {
      id: '5',
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      totalNumberofLog: '100',
      flightLog: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
    },

    {
      id: '6',
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      totalNumberofLog: '100',
      flightLog: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
    },
  ];

  ngOnInit() {
    this.defineColumns();
    this.defineBreadcrumbItems();
    this.defineChartDataAndOptions();

    this.logbookDashboardData = history.state.data;
    console.log(this.logbookDashboardData);
  }

  // Define values
  defineColumns() {
    this.columns = [
      { field: 'crewNameSurname', header: 'Crew Name & Surname' },
      { field: 'companyId', header: 'Company ID' },
      { field: 'totalNumberofLog', header: 'Total Number of Log' },
      { field: 'flightLog', header: 'Flight Log' },
      { field: 'simulatorFlightLogs', header: 'Simulator Flight Logs' },
      { field: 'approvedLogs', header: 'Approved Logs' },
      { field: 'reassingLogs', header: 'Reassing Logs' },
    ];
  }

  defineBreadcrumbItems() {
    this.breadcrumbItems = [
      { label: 'Logbook', route: '/logbook' },
      { label: 'Crew List' },
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
      cutout: '65%'
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

  tableRowSelected(event: any) {
    this.router.navigate(['logbook/logbook-detail'], {
      state: { data: event },
    });
  }
}
