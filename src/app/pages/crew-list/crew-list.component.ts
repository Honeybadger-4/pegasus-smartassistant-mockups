import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { CustomBreadcrumbComponent } from '@shared/components/custom-breadcrumb/custom-breadcrumb.component';
import { MenuItem } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logbook',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent, CustomBreadcrumbComponent, IconFieldModule, InputIconModule],
  templateUrl: './crew-list.component.html',
  styleUrl: './crew-list.component.scss',
})
export class CrewListComponent {
  breadcrumbItems: MenuItem[] = [];
  filterInput = '';
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
  
  columns!: Column[];
  router = inject(Router);

  ngOnInit() {
    this.defineMainColumns();

    this.breadcrumbItems = [
      { label: 'Logbook', route: '/logbook' },
      { label: 'Crew List' },
    ];
  }

  // Define Columns Operation
  defineMainColumns() {
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

  onRowSelect(selectedData: any) {
    
    console.log(selectedData);
  }

  goToLogBookDetailListPage(data: any) {
    // TODO: Logbook detail sayfasına yönlendirme yapılmalı ve tablodan seçilen data props geçilmeli detail ekranına. 
    this.router.navigate([
      'logbook/logbook-detail-edit',
      {
        data: JSON.stringify(data),
      },
    ]);
  }
}
