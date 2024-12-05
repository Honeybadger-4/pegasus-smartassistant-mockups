import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';

@Component({
  selector: 'app-logbook',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
  ],
  templateUrl: './logbook.component.html',
  styleUrl: './logbook.component.scss',
})
export class LogbookComponent {
  logbookData = [
    {
      id: '0',
      month: 'January 2019',
      totalNumberofLog: '100',
      flightLogs: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
      status: 'Approved',
    },
    {
      id: '1',
      month: 'February 2019',
      totalNumberofLog: '100',
      flightLogs: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
      status: 'Approved',
    },
    {
      id: '2',
      month: 'March 2019',
      totalNumberofLog: '100',
      flightLogs: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
      status: 'Approved',
    },
    {
      id: '3',
      month: 'April 2019',
      totalNumberofLog: '100',
      flightLogs: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
      status: 'Approved',
    },
    {
      id: '4',
      month: 'May 2019',
      totalNumberofLog: '100',
      flightLogs: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
      status: 'Approved',
    },
    {
      id: '5',
      month: 'June 2019',
      totalNumberofLog: '100',
      flightLogs: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '100',
      reassingLogs: '-',
      status: 'Approved',
    },

    {
      id: '6',
      month: 'July 2019',
      totalNumberofLog: '100',
      flightLogs: '70',
      simulatorFlightLogs: '30',
      approvedLogs: '95',
      reassingLogs: '5',
      status: 'Not Approved',
    },
  ];
  columns!: Column[];

  ngOnInit() {
    this.defineMainColumns();
  }

  // Define Columns Operation
  defineMainColumns() {
    this.columns = [
      { field: 'month', header: 'Month' },
      { field: 'totalNumberofLog', header: 'Total Number of Log' },
      { field: 'flightLogs', header: 'Flight Logs' },
      { field: 'simulatorFlightLogs', header: 'Simulator Flight Logs' },
      { field: 'approvedLogs', header: 'Approved Logs' },
      { field: 'reassingLogs', header: 'Reassing Logs' },
      { field: 'status', header: 'Status' },
    ];
  }
}
