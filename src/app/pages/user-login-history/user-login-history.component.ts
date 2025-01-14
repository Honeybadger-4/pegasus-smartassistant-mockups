import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { LoginInfoService } from '@shared/services/login-info.service';
import {
  ILoginInfoResponse,
  ILoginInfoTableData,
} from '@shared/models/login-info-response.model';
import { CalendarModule } from 'primeng/calendar';
import moment from 'moment';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-user-login-history',
    imports: [
        CommonModule,
        FormsModule,
        CustomTableComponent,
        CalendarModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
    ],
    templateUrl: './user-login-history.component.html',
    styleUrl: './user-login-history.component.scss'
})
export class UserLoginHistoryComponent {
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;
  @ViewChild('loggedInDateTemplate', { static: true })
  loggedInDateTemplate!: TemplateRef<any>;
  loginInfoService = inject(LoginInfoService);

  columns: Column[] = [];
  userLoginHistoryData = signal<ILoginInfoResponse | null>(null);
  userLoginHistoryTableData = signal<ILoginInfoTableData[]>([]);
  currentPage = 0;
  currentRows = 20;
  dateRange: Date[] = [];

  ngOnInit() {
    this.defineColumn();
    const today = moment();
    this.initialDateRangeValue();
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
      {
        field: 'loggedInDate',
        header: 'Logged In Date',
        template: this.loggedInDateTemplate,
      },
      { field: 'os', header: 'OS' },
      { field: 'osVersion', header: 'OS Version' },
      { field: 'userId', header: 'User ID' },
      { field: 'username', header: 'Username' },
    ];
  }

  initialDateRangeValue() {
    const today = moment();
    this.dateRange = [
      today.clone().subtract(7, 'days').toDate(),
      today.clone().add(7, 'days').toDate(),
    ];
  }

  getAllLoginInfo() {
    let startDate = '';
    let endDate = '';

    // Tarih aralığı kontrolü ve formatlama
    if (this.dateRange.length === 2) {
      const [start, end] = this.dateRange;

      if (start && end) {
        startDate = moment(start).format('YYYY-MM-DD');
        endDate = moment(end).format('YYYY-MM-DD');
      }
    }
    this.loginInfoService
      .getAllLoginInfo(startDate, endDate, this.currentPage, this.currentRows)
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

  onDateRangeChange(event: Event) {
    const [startDate, endDate] = this.dateRange;

    if (startDate && endDate) {
      this.currentPage = 0;
      this.customTableComponent.resetTableFirstValue();
      this.getAllLoginInfo();
    }
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getAllLoginInfo();
  }
}
