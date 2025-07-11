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
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

import moment from 'moment';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import {
  IReportsContentData,
  IReportsResponse,
} from '@shared/models/reports-response.model';
import { ReportsService } from '@shared/services/reports.service';
import { ReportsModalComponent } from 'src/app/components/reports-modal/reports-modal.component';

@Component({
  selector: 'app-report',
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ReportsModalComponent
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent implements OnInit {
   reportsColumnTemplate = viewChild.required('reportsColumnTemplate');
  customTableComponent = viewChild.required(CustomTableComponent);
  searchInput = viewChild.required<ElementRef>('searchInput');

  reportsService = inject(ReportsService);

  searchInputValue = signal<string>('');
  columns = signal<Column[]>([]);

  showReportsModal = signal<boolean>(false);
  selectedRowData = signal<IReportsContentData | null>(null);

  reportsData = signal<IReportsResponse | null>(null);
  reportsContentData = signal<IReportsResponse['content'] | null>(null);

  currentPage = signal<number>(0);
  currentRows = signal<number>(10);
  tableLoading = signal<boolean>(false);

  tableFilters = signal<any>({});

  ngOnInit() {
    this.defineColumn();
    this.setupSearchListener();
  }

  defineColumn() {
    this.columns.set([
      { field: 'aircraftReg', header: 'Ac Reg', isFilter: true },
      { field: 'flightNo', header: 'Flight No', isFilter: true },
      { field: 'depPort', header: 'Departure Port', isFilter: true },
      {
        field: 'depDateTime',
        header: 'Departure Date',
        isFilter: true,
        filterType: 'datepicker',
      },

      { field: 'arrPort', header: 'Arr Port', isFilter: true },
      {
        field: 'arrDateTime',
        header: 'Arrival Date',
        isFilter: true,
        filterType: 'datepicker',
      },

      {
        field: 'createdBy',
        header: 'Sent By',
        isFilter: true,
      },
      {
        field: 'enteredDate',
        header: 'Sent Date - Time',
        isFilter: true,
        filterType: 'datepicker',
      },

      {
         field: 'show',
         header: 'Report Details',
         isFilter: false,
         template: this.reportsColumnTemplate(),
       },
    ]);
  }

  getAllReports() {
    this.tableLoading.set(true);
    this.reportsService
      .getAllReports(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        this.tableFilters(),
      )
      .subscribe({
        next: (response: IReportsResponse) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
              arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            checkedDate: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            enteredDate: item.enteredDate
              ? moment(item.enteredDate).format('DD/MM/YYYY - HH:mm')
              : null,
              doorClosed: item.doorClosed
              ? moment(item.doorClosed).format('DD/MM/YYYY - HH:mm')
              : null,
              offBlock: item.offBlock
              ? moment(item.offBlock).format('DD/MM/YYYY - HH:mm')
              : null,
              takeOff: item.takeOff
              ? moment(item.takeOff).format('DD/MM/YYYY - HH:mm')
              : null,
              landing: item.landing
              ? moment(item.landing).format('DD/MM/YYYY - HH:mm')
              : null,
              onBlock: item.onBlock
              ? moment(item.onBlock).format('DD/MM/YYYY - HH:mm')
              : null,
              doorOpen: item.doorOpen
              ? moment(item.doorOpen).format('DD/MM/YYYY - HH:mm')
              : null,
          }));

          this.reportsContentData.set(formattedData);
          this.reportsData.set(response);

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

          this.getAllReports();
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
      acReg: event.filters?.aircraftReg?.[0]?.value,
      flightNo: event.filters?.flightNo?.[0]?.value,
      depPort: event.filters?.depPort?.[0]?.value,
      depDate: event.filters?.depDateTime?.[0]?.value,
      arrPort: event.filters?.arrPort?.[0]?.value,
      arrDate: event.filters?.arrDateTime?.[0]?.value,
      sentBy: event.filters?.createdBy?.[0]?.value,
      sentDate: event.filters?.enteredDate?.[0]?.value,
    });
    this.getAllReports();
  }

   onReportsShow(rowData: IReportsContentData) {
     this.selectedRowData.set(rowData);
     this.showReportsModal.set(true);
   }

   get reportsModalVisible() {
     return this.showReportsModal();
   }

   set reportsModalVisible(value: boolean) {
     this.showReportsModal.set(value);
   }
}
