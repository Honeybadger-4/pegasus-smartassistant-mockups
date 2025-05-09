import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';

import { TripInfoService } from '@shared/services/trip-info.service';
import {
  ITripInfoResponse,
  ITripInfoTableData,
} from '@shared/models/trip-info-response.model';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import moment from 'moment';

@Component({
  selector: 'app-trip-info',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomTableComponent,
    DatePickerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './trip-info.component.html',
  styleUrl: './trip-info.component.scss',
})
export class TripInfoComponent implements OnInit {
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;

  tripInfoService = inject(TripInfoService);

  searchInputValue = '';
  columns: Column[] = [];
  currentPage = 0;
  currentRows = 20;
  tableLoading = false;

  tripInfoData = signal<ITripInfoResponse | null>(null);
  tripInfoTableData = signal<ITripInfoTableData[]>([]);

  ngOnInit() {
    this.defineColumn();
    this.getTripInfo();
  }

  defineColumn() {
    this.columns = [
      { field: 'acReg', header: 'Ac Reg', isFilter: true },
      { field: 'flightNo', header: 'Flight No', isFilter: true },
      {
        field: 'depDateTime',
        header: 'Dep. Date-time',
        isFilter: true,
        filterType: 'datepicker',
      },
      { field: 'sentBy', header: 'Sent By', isFilter: true },
      {
        field: 'sentDateTime',
        header: 'Sent Date - Time',
        isFilter: true,
        filterType: 'datepicker',
      },
      { field: 'details', header: 'Details' },
    ];
  }

  getTripInfo() {
    this.tableLoading = true;

    this.tripInfoService
      .getTripInfo(this.currentPage, this.currentRows)
      .subscribe({
        next: (response) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depDateTime: moment(item.depDateTime).format('DD/MM/YYYY - HH:mm'),
          }));

          this.tripInfoData.set(response);
          this.tripInfoTableData.set(formattedData);
          this.tableLoading = false;
        },
        error: () => {
          this.tableLoading = false;
        },
      });
  }

  onChangeSearch(value: string) {}

  lazyLoadEvent(event: any) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getTripInfo();
  }
}
