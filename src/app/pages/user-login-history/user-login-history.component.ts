import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

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
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-login-history',
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    DatePickerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule
  ],
  templateUrl: './user-login-history.component.html',
  styleUrl: './user-login-history.component.scss',
})
export class UserLoginHistoryComponent {
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;
  @ViewChild('loggedInDateTemplate', { static: true })
  loggedInDateTemplate!: TemplateRef<any>;
  loginInfoService = inject(LoginInfoService);
  formBuilder = inject(FormBuilder);

  filterFormGroup!: FormGroup;
  columns: Column[] = [];
  currentPage = 0;
  currentRows = 20;
  dateRange: Date[] = [];
  tableLoading: boolean = false;

  userLoginHistoryData = signal<ILoginInfoResponse | null>(null);
  userLoginHistoryTableData = signal<ILoginInfoTableData[]>([]);

  ngOnInit() {
    this.builder();
    this.defineColumn();
    this.getAllLoginInfo();
  }

  builder() {
    this.filterFormGroup = this.formBuilder.group({
      username: [''],
      companyID: [''],
      dateRange: [this.dateRangeDefaultValue()],
    });
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

  getAllLoginInfo() {
    this.tableLoading = true;

    const formValues = this.filterFormGroup.value;
    const username = formValues.username?.trim() || null;
    const companyID = formValues.companyID?.trim() || null;

    let startDate = '';
    let endDate = '';

    // Tarih aralığı kontrolü ve formatlama
    if (formValues.dateRange && formValues.dateRange.length === 2) {
      const [start, end] = formValues.dateRange;

      if (start && end) {
        startDate = moment(start).format('YYYY-MM-DD');
        endDate = moment(end).format('YYYY-MM-DD');
      }
    }
    this.loginInfoService
      .getAllLoginInfo(
        this.currentPage,
        this.currentRows,
        startDate,
        endDate,
        username,
        companyID,
      )
      .subscribe({
        next: (response) => {
          this.userLoginHistoryData.set(response);
          this.userLoginHistoryTableData.set(response.content);
          this.tableLoading = false;
        },
        error: () => {
          this.tableLoading = false;
        },
      });
  }

  onFilterSubmit() {
    this.getAllLoginInfo();
  }

  dateRangeDefaultValue() {
    const endDate = moment();
    const startDate = moment().subtract(3, 'days');

    return [startDate.toDate(), endDate.toDate()];
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getAllLoginInfo();
  }
}
