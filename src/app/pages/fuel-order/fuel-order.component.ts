import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';

import { Column } from '@shared/models/columns';
import { FormsModule } from '@angular/forms';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { FuelOrderService } from '@shared/services/fuel-order.service';
import {
  IFuelOrderResponse,
  IFuelOrderContentData,
} from '@shared/models/fuel-order-response.model';
import moment from 'moment';
@Component({
  selector: 'app-fuel-order',
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './fuel-order.component.html',
  styleUrl: './fuel-order.component.scss',
})
export class FuelOrderComponent implements OnInit {
  customTableComponent = viewChild.required(CustomTableComponent);
  searchInput = viewChild.required<ElementRef>('searchInput');

  fuelOrderService = inject(FuelOrderService);

  searchInputValue = signal<string>('');

  columns = signal<Column[]>([]);
  selectedRow = signal<IFuelOrderContentData | null>(null);

  fuelOrderData = signal<IFuelOrderResponse | null>(null);
  fuelOrderContentData = signal<IFuelOrderResponse['content'] | null>(
    null,
  );

  currentPage = signal<number>(0);
  currentRows = signal<number>(10);
  tableFilters = signal<any>({});

  tableLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.defineColumns();
    this.setupSearchListener();
  }

  defineColumns() {
    this.columns.set([
      { field: 'acReg', header: 'Ac Reg', isFilter: true },
      { field: 'flightNo', header: 'Flight No', isFilter: true },
      { field: 'depPort', header: 'Departure Port', isFilter: true },
      {
        field: 'depDateTime',
        header: 'Departure Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      { field: 'arrPort', header: 'Arrival Port', isFilter: true },
      {
        field: 'arrDateTime',
        header: 'Arrival Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      { field: 'amount', header: 'Amount', isFilter: true },
      { field: 'user', header: 'User', isFilter: true },
      {
        field: 'orderDateTime',
        header: 'Order Date',
        isFilter: true,
        filterType: 'datepicker',
      },
    ]);
  }

  getAllFuelOrder() {
    this.tableLoading.set(true);

    this.fuelOrderService
      .getAllFuelOrder(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        this.tableFilters(),
      )
      .subscribe({
        next: (response: IFuelOrderResponse) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,

            arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            orderDateTime: item.orderDateTime
              ? moment(item.orderDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
          }));

          this.fuelOrderContentData.set(formattedData);
          this.fuelOrderData.set(response);

          this.tableLoading.set(false);
        },
        error: () => {
          this.tableLoading.set(false);
        },
      });
  }

  setupSearchListener() {
    fromEvent<Event>(this.searchInput().nativeElement, 'input')
      .pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((searchText) => {
        if (searchText.trim() || searchText === '') {
          this.currentPage.set(0);
          this.customTableComponent().resetTableFirstValue();

          this.getAllFuelOrder();
        }
      });
  }

  onChangeSearch(value: string) {
    this.searchInputValue.set(value.toUpperCase());
    this.currentPage.set(0);
    this.customTableComponent().resetTableFirstValue();
    this.getAllFuelOrder();
  }
  lazyLoadEvent(event: any) {
    const page = event.first / event.rows;
    this.currentPage.set(page);
    this.currentRows.set(event.rows);

    this.tableFilters.set({
      acReg: event.filters?.acReg && event.filters?.acReg[0].value,
      flightNo: event.filters?.flightNo && event.filters?.flightNo[0].value,
      depPort: event.filters?.depPort && event.filters?.depPort[0].value,
      depDate:
        event.filters?.depDateTime && event.filters?.depDateTime[0].value,

      arrPort: event.filters?.arrPort && event.filters?.arrPort[0].value,

      arrDate:
        event.filters?.arrDateTime && event.filters?.arrDateTime[0].value,

      amount: event.filters?.amount && event.filters?.amount[0].value,
      user: event.filters?.user && event.filters?.user[0].value,
      orderDate:
        event.filters?.orderDateTime && event.filters?.orderDateTime[0].value,
    });

    this.getAllFuelOrder();
  }
}
