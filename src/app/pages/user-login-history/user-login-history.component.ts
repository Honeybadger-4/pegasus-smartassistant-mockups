import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { DropdownModule } from 'primeng/dropdown';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { LoginInfoService } from '@shared/services/login-info.service';
import {
  ILoginInfoResponse,
  ILoginInfoTableData,
} from '@shared/models/login-info-response.model';
import { PERIOD_OPTIONS } from '@shared/constants/global-constant';

@Component({
  selector: 'app-user-login-history',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, CustomTableComponent],
  templateUrl: './user-login-history.component.html',
  styleUrl: './user-login-history.component.scss',
})
export class UserLoginHistoryComponent {
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;
  loginInfoService = inject(LoginInfoService);

  columns: Column[] = [];
  userLoginHistoryData = signal<ILoginInfoResponse | null>(null);
  userLoginHistoryTableData = signal<ILoginInfoTableData[]>([]);
  currentPage = 0;
  currentRows = 20;
  periodOptions: any;
  selectedPeriod = '';

  ngOnInit() {
    this.periodOptions = PERIOD_OPTIONS;
    this.selectedPeriod = this.periodOptions[0].value;
    this.defineColumn();
  }

  defineColumn() {
    this.columns = [
      { field: 'appVersion', header: 'App Version' },
      { field: 'channel', header: 'Channel' },
      { field: 'companyId', header: 'Company ID' },
      { field: 'deviceBrand', header: 'Device Brand' },
      { field: 'deviceId', header: 'Device ID' },
      { field: 'deviceModel', header: 'Device Model' },
      { field: 'ipAddress', header: 'IP Address' },
      { field: 'loggedInDate', header: 'Logged In Date' },
      { field: 'os', header: 'OS' },
      { field: 'osVersion', header: 'OS Version' },
      { field: 'userId', header: 'User ID' },
      { field: 'username', header: 'Username' },
    ];
  }

  getAllLoginInfo(page: number, size: number) {
    this.loginInfoService
      .getAllLoginInfo(this.selectedPeriod, page, size)
      .subscribe({
        next: (response) => {
          this.userLoginHistoryData.set(response);
          this.userLoginHistoryTableData.set(response.content);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onPeriodChange(event: any) {
    this.currentPage = 0;
    this.customTableComponent.resetTableFirstValue();
    this.getAllLoginInfo(this.currentPage, this.currentRows);
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getAllLoginInfo(page, event.rows);
  }
}
