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
import { FormsModule } from '@angular/forms';
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

  fuelOrderService = inject(FuelOrderService);
  fuelOrderHistoryData = signal<IFuelOrderResponse | null>(null);
  fuelOrderHistoryTableData = signal<IFuelOrderTableData[]>([]);
  currentPage = 0;
  currentRows = 20;

  ngOnInit() {
    this.defineColumns();
    const today = moment();
    this.initialDateRangeValue();
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

  initialDateRangeValue() {
    const today = moment();
    this.dateRange = [
      today.clone().subtract(7, 'days').toDate(),
      today.clone().add(7, 'days').toDate(),
    ];
  }

  getFuelOrder() {
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
  
    // Filtreleme alanlarından değerleri alın
    const acReg = (document.querySelector('input[placeholder="Aircraft"]') as HTMLInputElement)?.value || null;
    const flightNo = (document.querySelector('input[placeholder="Flight No"]') as HTMLInputElement)?.value || null;
    const depPort = (document.querySelector('input[placeholder="Dep Port"]') as HTMLInputElement)?.value || null;
    const arrPort = (document.querySelector('input[placeholder="Arr Port"]') as HTMLInputElement)?.value || null;
  
    this.fuelOrderService
      .getFuelOrder(this.currentPage, this.currentRows, startDate, endDate, acReg, flightNo, depPort, arrPort)
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
