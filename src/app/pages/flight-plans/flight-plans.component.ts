import { Component, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';

import { Chip } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-flight-plans',
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    Chip,
  ],
  templateUrl: './flight-plans.component.html',
  styleUrl: './flight-plans.component.scss',
})
export class FlightPlansComponent implements OnInit {
  customTableComponent = viewChild.required(CustomTableComponent);
  flightPlansColumnTemplate = viewChild.required('flightPlansColumnTemplate');
  statusColumnTemplate = viewChild.required('statusColumnTemplate');

  searchInputValue = '';
  columns = signal<Column[]>([]);
  selectedRowData: any = null;

  flightPlansData = [
    {
      acReg: 'lorem',
      flightNo: 'lorem',
      depDateTime: '01/01/2020 - 10:29',
      receivedDateTime: '01/01/2020 - 10:29',
      version: 'V1',

      responsibleUser: 'Name Surname',
      status: 'SUBMITTED',
      approvedDateTime: '01/01/2020 - 10:29',
      replacedDateTime: '01/01/2020 - 10:29',
      declinedDateTime: '01/01/2020 - 10:29',

      submittedDateTime: '01/01/2020 - 10:29',
      flightPlan: '',
    },
    {
      acReg: 'lorem',
      flightNo: 'lorem',
      depDateTime: '01/01/2020 - 10:29',
      receivedDateTime: '01/01/2020 - 10:29',
      version: 'V1',

      responsibleUser: 'Name Surname',
      status: 'APPROVED',
      approvedDateTime: '01/01/2020 - 10:29',
      replacedDateTime: '01/01/2020 - 10:29',
      declinedDateTime: '01/01/2020 - 10:29',

      submittedDateTime: '01/01/2020 - 10:29',
      flightPlan: '',
    },
    {
      acReg: 'lorem',
      flightNo: 'lorem',
      depDateTime: '01/01/2020 - 10:29',
      receivedDateTime: '01/01/2020 - 10:29',
      version: 'V1',

      responsibleUser: 'Name Surname',
      status: 'DECLINED',
      approvedDateTime: '01/01/2020 - 10:29',
      replacedDateTime: '01/01/2020 - 10:29',
      declinedDateTime: '01/01/2020 - 10:29',

      submittedDateTime: '01/01/2020 - 10:29',
      flightPlan: '',
    },
    {
      acReg: 'lorem',
      flightNo: 'lorem',
      depDateTime: '01/01/2020 - 10:29',
      receivedDateTime: '01/01/2020 - 10:29',
      version: 'V1',

      responsibleUser: 'Name Surname',
      status: 'SUBMITTED',
      approvedDateTime: '01/01/2020 - 10:29',
      replacedDateTime: '01/01/2020 - 10:29',
      declinedDateTime: '01/01/2020 - 10:29',

      submittedDateTime: '01/01/2020 - 10:29',
      flightPlan: '',
    },
    {
      acReg: 'lorem',
      flightNo: 'lorem',
      depDateTime: '01/01/2020 - 10:29',
      receivedDateTime: '01/01/2020 - 10:29',
      version: 'V1',

      responsibleUser: 'Name Surname',
      status: 'APPROVED',
      approvedDateTime: '01/01/2020 - 10:29',
      replacedDateTime: '01/01/2020 - 10:29',
      declinedDateTime: '01/01/2020 - 10:29',

      submittedDateTime: '01/01/2020 - 10:29',
      flightPlan: '',
    },
    {
      acReg: 'lorem',
      flightNo: 'lorem',
      depDateTime: '01/01/2020 - 10:29',
      receivedDateTime: '01/01/2020 - 10:29',
      version: 'V1',

      responsibleUser: 'Name Surname',
      status: 'DECLINED',
      approvedDateTime: '01/01/2020 - 10:29',
      replacedDateTime: '01/01/2020 - 10:29',
      declinedDateTime: '01/01/2020 - 10:29',

      submittedDateTime: '01/01/2020 - 10:29',
      flightPlan: '',
    },
    {
      acReg: 'lorem',
      flightNo: 'lorem',
      depDateTime: '01/01/2020 - 10:29',
      receivedDateTime: '01/01/2020 - 10:29',
      version: 'V1',

      responsibleUser: 'Name Surname',
      status: 'WAITING_APPROVE',
      approvedDateTime: '01/01/2020 - 10:29',
      replacedDateTime: '01/01/2020 - 10:29',
      declinedDateTime: '01/01/2020 - 10:29',

      submittedDateTime: '01/01/2020 - 10:29',
      flightPlan: '',
    },
    {
      acReg: 'lorem',
      flightNo: 'lorem',
      depDateTime: '01/01/2020 - 10:29',
      receivedDateTime: '01/01/2020 - 10:29',
      version: 'V1',

      responsibleUser: 'Name Surname',
      status: 'REPLACED',
      approvedDateTime: '01/01/2020 - 10:29',
      replacedDateTime: '01/01/2020 - 10:29',
      declinedDateTime: '01/01/2020 - 10:29',

      submittedDateTime: '01/01/2020 - 10:29',
      flightPlan: '',
    },
    {
      acReg: 'lorem',
      flightNo: 'lorem',
      depDateTime: '01/01/2020 - 10:29',
      receivedDateTime: '01/01/2020 - 10:29',
      version: 'V1',

      responsibleUser: 'Name Surname',
      status: 'WAITING_APPROVE',
      approvedDateTime: '01/01/2020 - 10:29',
      replacedDateTime: '01/01/2020 - 10:29',
      declinedDateTime: '01/01/2020 - 10:29',

      submittedDateTime: '01/01/2020 - 10:29',
      flightPlan: '',
    },
    {
      acReg: 'lorem',
      flightNo: 'lorem',
      depDateTime: '01/01/2020 - 10:29',
      receivedDateTime: '01/01/2020 - 10:29',
      version: 'V1',

      responsibleUser: 'Name Surname',
      status: 'REPLACED',
      approvedDateTime: '01/01/2020 - 10:29',
      replacedDateTime: '01/01/2020 - 10:29',
      declinedDateTime: '01/01/2020 - 10:29',

      submittedDateTime: '01/01/2020 - 10:29',
      flightPlan: '',
    },
  ];

  ngOnInit() {
    this.defineColumn();
  }

  defineColumn() {
    this.columns.set([
      { field: 'acReg', header: 'Ac Reg', isFilter: true },
      { field: 'flightNo', header: 'Flight No', isFilter: true },
      {
        field: 'depDateTime',
        header: 'Dep Date - Time',
        isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'receivedDateTime',
        header: 'Received Date - Time',
        isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'version',
        header: 'Version',
        isFilter: true,
      },

      { field: 'responsibleUser', header: 'Responsible User', isFilter: true },
      {
        field: 'status',
        header: 'Status',
        isFilter: false,
        template: this.statusColumnTemplate(),
      },

      {
        field: 'approvedDateTime',
        header: 'Approved Date - Time',
        isFilter: true,
      },
      {
        field: 'replacedDateTime',
        header: 'Replaced Date - Time',
        isFilter: true,
      },
      {
        field: 'declinedDateTime',
        header: 'Declined Date - Time',
        isFilter: true,
      },
      {
        field: 'submittedDateTime',
        header: 'Submitted Date - Time',
        isFilter: true,
      },
      {
        field: 'flightPlan',
        header: 'Flight Plan',
        isFilter: true,
        template: this.flightPlansColumnTemplate(),
      },
    ]);
  }

  onChangeSearch(value: string) {}

  onFlightPlansShow(rowData: any) {}
}
