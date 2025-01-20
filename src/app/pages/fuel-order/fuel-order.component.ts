import { Component, Inject, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { FuelOrderService } from '@shared/services/fuel-order.service';
import { Column } from '@shared/models/columns';
import {
  IFuelOrderResponse,
  IFuelOrderTableData,
} from '@shared/models/fuel-order-response.model';
import moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fuel',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DatePicker,
    ButtonModule,
    DatePipe
  ],
  templateUrl: './fuel-order.component.html',
  styleUrl: './fuel-order.component.scss',
})
export class FuelOrderComponent {
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;

  filterFormGroup!: FormGroup;
  columns!: Column[];
  tableLoading: boolean = false;
  dateRange: Date[] = [];
  currentPage = 0;
  currentRows = 20;

  fuelOrderHistoryData = signal<IFuelOrderResponse | null>(null);
  fuelOrderHistoryTableData = signal<IFuelOrderTableData[]>([]);


  formBuilder = inject(FormBuilder);
  fuelOrderService = inject(FuelOrderService);
  

  ngOnInit() {
    this.builder();
    this.defineColumns();
    this.getFuelOrder();
  }

  builder() {
    this.filterFormGroup = this.formBuilder.group({
      acReg: [''],
      flightNo: [''],
      depPort: [''],
      arrPort: [''],
      dateRange: [this.dateRangeDefaultValue()],
    });
  }

  defineColumns() {
    this.columns = [
      { field: 'aircraftReg', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'depPort', header: 'Departure' },
      { field: 'arrPort', header: 'Arrival' },
      { field: 'depDateTime', header: 'Dep Date/Time' },
      { field: 'arrDateTime', header: 'Arr Date/Time' },
      { field: 'amount', header: 'Amount' },
      { field: 'userName', header: 'User' },
      { field: 'orderDateTime', header: 'Order Date / Time' },
    ];
  }

  // API Calls Operations
  getFuelOrder() {
    this.tableLoading = true;

    const formValues = this.filterFormGroup.value;
    const acReg = formValues.acReg?.trim() || null;
    const flightNo = formValues.flightNo?.trim() || null;
    const depPort = formValues.depPort?.trim() || null;
    const arrPort = formValues.arrPort?.trim() || null;

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

    this.fuelOrderService
      .getFuelOrder(
        this.currentPage,
        this.currentRows,
        startDate,
        endDate,
        acReg,
        flightNo,
        depPort,
        arrPort,
      )
      .subscribe({
        next: (response) => {
          this.fuelOrderHistoryData.set(response);
          this.fuelOrderHistoryTableData.set(response.content);
          this.tableLoading = false;
        },
        error: () => {
          this.tableLoading = false;
        },
      });
  }

  // Filter Operations
  dateRangeDefaultValue() {
    const endDate = moment();
    const startDate = moment().subtract(3, 'days');

    return [startDate.toDate(), endDate.toDate()];
  }

  onFilterSubmit() {
    this.getFuelOrder();
  }

  // Other Operations
  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getFuelOrder();
  }
}
