import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { CalendarModule } from 'primeng/calendar';
import { FuelOrderService } from '@shared/services/fuel-order.service';
import {
  IFuelOrderResponse,
  IFuelOrderTableData,
} from '@shared/models/fuel-order-response.model';
import moment from 'moment';

@Component({
  selector: 'app-fuel',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    CustomTableComponent,
    CalendarModule,
  ],
  templateUrl: './fuel-order.component.html',
  styleUrl: './fuel-order.component.scss',
})
export class FuelOrderComponent {
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;
  columns!: Column[];
  dateRange: Date[] = [];
  formBuilder = inject(FormBuilder);

  fuelOrderService = inject(FuelOrderService);
  fuelOrderHistoryData = signal<IFuelOrderResponse | null>(null);
  fuelOrderHistoryTableData = signal<IFuelOrderTableData[]>([]);
  currentPage = 0;
  currentRows = 20;
  filterFormGroup!: FormGroup;

  ngOnInit() {
    this.builder();
    this.defineColumns();
    const today = moment();
    this.dateRangeDefaultValue();
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
    ];
  }

  dateRangeDefaultValue() {
    const today = moment();
    return [today.clone().subtract(7, 'days').toDate(), today.clone().toDate()];
  }

  onFilterSubmit() {
    this.getFuelOrder();
  }

  getFuelOrder() {
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
      this.getFuelOrder();
    }
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getFuelOrder();
  }
}
