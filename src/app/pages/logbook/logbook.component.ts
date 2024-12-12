import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';

@Component({
  selector: 'app-logbook',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent],
  templateUrl: './logbook.component.html',
  styleUrl: './logbook.component.scss',
})
export class LogbookComponent {
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

  ngOnInit() {
    this.defineMainColumns();
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
}
