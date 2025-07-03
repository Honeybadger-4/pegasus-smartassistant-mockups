import {
  Component,
  ElementRef,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { TripInfoService } from '@shared/services/trip-info.service';
import {
  ITripInfoResponse,
  ITripInfoTableData,
} from '@shared/models/trip-info-response.model';
import { ITripInfoDetailsResponse } from '@shared/models/trip-info-details-response.model';
import { TripInfoDetailsModalComponent } from '../../components/trip-info-details-modal/trip-info-details-modal.component';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-trip-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TripInfoDetailsModalComponent,
  ],
  templateUrl: './trip-info.component.html',
  styleUrl: './trip-info.component.scss',
})
export class TripInfoComponent implements OnInit {
  customTableComponent = viewChild.required(CustomTableComponent);
  searchInput = viewChild.required<ElementRef>('searchInput');
  detailsColumnTemplate = viewChild.required('detailsColumnTemplate');

  tripInfoService = inject(TripInfoService);

  searchInputValue = signal<string>('');

  columns = signal<Column[]>([]);

  tripInfoData = signal<ITripInfoResponse | null>(null);
  tripInfoTableData = signal<ITripInfoResponse['content'] | null>(null);

  tripInfoDetailsLoading = signal<boolean>(false);
  tripInfoDetails = signal<ITripInfoDetailsResponse | null>(null);

  currentPage = signal<number>(0);
  currentRows = signal<number>(10);

  tableLoading = signal<boolean>(false);

  tableFilters = signal<any>({});

  showTripInfoDetailsModal = signal<boolean>(false);
  selectedRowData = signal<ITripInfoTableData | null>(null);

  ngOnInit() {
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
      { field: 'sentBy', header: 'Sent By', isFilter: true },
      {
        field: 'sentDateTime',
        header: 'Sent Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'details',
        header: 'Details',
        isFilter: false,
        template: this.detailsColumnTemplate(),
      },
    ]);
  }

  getTripInfo() {
    this.tableLoading.set(true);
    this.tripInfoService
      .getTripInfo(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        this.tableFilters(),
      )
      .subscribe({
        next: (response: ITripInfoResponse) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            sentDateTime: item.sentDateTime
              ? moment(item.sentDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
          }));

          this.tripInfoTableData.set(formattedData);
          this.tripInfoData.set(response);
          this.tableLoading.set(false);
        },
        error: () => this.tableLoading.set(false),
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

          this.getTripInfo();
        }
      });
  }

  onChangeSearch(value: string) {
    this.searchInputValue.set(value.toUpperCase());
  }

  lazyLoadEvent(event: any) {
    const page = event.first / event.rows;
    this.currentPage.set(page);
    this.currentRows.set(event.rows);

    this.tableFilters.set({
      acReg: event.filters?.acReg && event.filters?.acReg[0].value,
      flightNo: event.filters?.flightNo && event.filters?.flightNo[0].value,
      depDate:
        event.filters?.depDateTime && event.filters?.depDateTime[0].value,
      sentBy: event.filters?.sentBy && event.filters?.sentBy[0].value,
      sentDate:
        event.filters?.sentDateTime && event.filters?.sentDateTime[0].value,
      arrPort: event.filters?.arrPort && event.filters?.arrPort[0].value,
      depPort: event.filters?.depPort && event.filters?.depPort[0].value,
      arrDate:
        event.filters?.arrDateTime && event.filters?.arrDateTime[0].value,
    });

    this.getTripInfo();
  }

  onTripInfoDetailsShow(rowData: ITripInfoTableData) {
    this.tripInfoService.getTripInfoDetails(rowData.id).subscribe({
      next: (data) => {
        this.tripInfoDetails.set(data);
        this.showTripInfoDetailsModal.set(true);
      },
      error: (err) => {
        console.error('Trip Info Details fetch failed:', err);
      },
    });
  }

  get tripInfoDetailsModalVisible() {
    return this.showTripInfoDetailsModal();
  }
  set tripInfoDetailsModalVisible(val: boolean) {
    this.showTripInfoDetailsModal.set(val);
  }
}
