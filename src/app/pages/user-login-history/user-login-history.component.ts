import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';

import { Column } from '@shared/models/columns';

import {
  IUserLoginHistoryResponse,
  IUserLoginHistoryContentData,
} from '@shared/models/user-login-history-response.model';
import { UserLoginHistoryService } from '@shared/services/user-login-history.service';
import moment from 'moment';
import * as XLSX from 'xlsx-js-style';
import * as FileSaver from 'file-saver';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-login-history',
  imports: [CommonModule, CustomTableComponent, ButtonModule],
  templateUrl: './user-login-history.component.html',
  styleUrl: './user-login-history.component.scss',
})
export class UserLoginHistoryComponent implements OnInit {
  customTableComponent = viewChild.required(CustomTableComponent);

  userLoginHistoryService = inject(UserLoginHistoryService);

  columns = signal<Column[]>([]);
  selectedRow = signal<IUserLoginHistoryContentData | null>(null);

  userLoginHistoryData = signal<IUserLoginHistoryResponse | null>(null);
  userLoginHistoryContentData = signal<
    IUserLoginHistoryResponse['content'] | null
  >(null);

  currentPage = signal<number>(0);
  currentRows = signal<number>(10);
  tableFilters = signal<any>({});

  tableLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.defineColumns();
  }

  defineColumns() {
    this.columns.set([
      { field: 'username', header: 'Username', isFilter: true },
      { field: 'companyId', header: 'Company ID', isFilter: true },

      {
        field: 'loggedInDate',
        header: 'Logged In Date',
        isFilter: true,
        filterType: 'datepicker',
      },

      { field: 'appVersion', header: 'App Version', isFilter: true },
      { field: 'channel', header: 'Channel', isFilter: true },
      { field: 'deviceBrand', header: 'Device Brand', isFilter: true },
      { field: 'deviceModel', header: 'Device Model', isFilter: true },

      {
        field: 'deviceId',
        header: 'Device ID',
        isFilter: true,
      },

      {
        field: 'ipAddress',
        header: 'IP Address',
        isFilter: true,
      },

      { field: 'os', header: 'OS', isFilter: true },

      { field: 'osVersion', header: 'OS Version', isFilter: true },
    ]);
  }

  getAllUserLoginHistory() {
    this.tableLoading.set(true);

    this.userLoginHistoryService
      .getAllUserLoginHistory(
        this.currentPage(),
        this.currentRows(),
        this.tableFilters(),
      )
      .subscribe({
        next: (response: IUserLoginHistoryResponse) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            loggedInDate: item.loggedInDate
              ? moment(item.loggedInDate).format('DD/MM/YYYY - HH:mm')
              : null,
          }));

          this.userLoginHistoryContentData.set(formattedData);
          this.userLoginHistoryData.set(response);

          this.tableLoading.set(false);
        },
        error: () => {
          this.tableLoading.set(false);
        },
      });
  }

  lazyLoadEvent(event: any) {
    const page = event.first / event.rows;
    this.currentPage.set(page);
    this.currentRows.set(event.rows);

    this.tableFilters.set({
      appVersion:
        event.filters?.appVersion && event.filters?.appVersion[0].value,
      channel: event.filters?.channel && event.filters?.channel[0].value,
      companyId: event.filters?.companyId && event.filters?.companyId[0].value,
      deviceBrand:
        event.filters?.deviceBrand && event.filters?.deviceBrand[0].value,
      deviceId: event.filters?.deviceId && event.filters?.deviceId[0].value,
      deviceModel:
        event.filters?.deviceModel && event.filters?.deviceModel[0].value,
      ipAddress: event.filters?.ipAddress && event.filters?.ipAddress[0].value,
      loggedInDate:
        event.filters?.loggedInDate && event.filters?.loggedInDate[0].value,
      os: event.filters?.os && event.filters?.os[0].value,
      osVersion: event.filters?.osVersion && event.filters?.osVersion[0].value,
      username: event.filters?.username && event.filters?.username[0].value,
    });

    this.getAllUserLoginHistory();
  }

  exportExcel() {
    const data = this.userLoginHistoryContentData() || [];
    if (!data.length) {
      return;
    }

    const cols = this.columns();
    const fields = cols.map((c) => c.field);
    const headers = cols.map((c) => c.header);

    const aoa = [
      headers,
      ...data.map((item) =>
        fields.map((f) => {
          const v = (item as any)[f];
          return v != null ? v : '';
        }),
      ),
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: range.s.r, c: C });
      const cell = worksheet[cellRef];
      if (cell) {
        cell.s = {
          fill: { fgColor: { rgb: 'DDEBF7' } },
          font: { bold: true, color: { rgb: '000000' } },
          alignment: { horizontal: 'center', vertical: 'center' },
        };
      }
    }

    const workbook: XLSX.WorkBook = {
      Sheets: { UserLoginHistory: worksheet },
      SheetNames: ['UserLoginHistory'],
    };
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const fileName = `UserLoginHistory_${moment().format('YYYYMMDD_HHmm')}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }
}
