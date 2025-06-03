import {
  Component,
  OnInit,
  signal,
  viewChild,
  inject,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { GpsLossFormsModalComponent } from 'src/app/components/gps-loss-forms-modal/gps-loss-forms-modal.component';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { GpsSignalLossService } from '@shared/services/gps-signal-loss.service';

import {
  IGpsLossFormContentData,
  IGpsLossFormsResponse,
} from '@shared/models/gps-loss-forms-response.model';
import moment from 'moment';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
@Component({
  selector: 'app-gps-loss-forms',
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    GpsLossFormsModalComponent,
  ],
  templateUrl: './gps-loss-forms.component.html',
  styleUrl: './gps-loss-forms.component.scss',
})
export class GpsLossFormsComponent implements OnInit {
  gpsLossFormsColumnTemplate = viewChild.required('gpsLossFormsColumnTemplate');
  customTableComponent = viewChild.required(CustomTableComponent);
  searchInput = viewChild.required<ElementRef>('searchInput');

  gpsLossFormsService = inject(GpsSignalLossService);

  searchInputValue = signal<string>('');





  
  columns = signal<Column[]>([]);

  showModal = signal<boolean>(false);

  selectedRow = signal<IGpsLossFormContentData | null>(null);

  gpsLossFormsData = signal<IGpsLossFormsResponse | null>(null);
  gpsLossFormsContentData = signal<IGpsLossFormsResponse['content'] | null>(
    null,
  );

  currentPage = signal<number>(0);
  currentRows = signal<number>(10);
  tableFilters = signal<any>({});
  tableLoading = signal<boolean>(false);

  ngOnInit() {
    this.defineColumn();
    this.setupSearchListener();
  }

  defineColumn() {
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
      { field: 'firstPointName', header: 'First Point', isFilter: true },
      { field: 'lastPointName', header: 'Last Point', isFilter: true },
      { field: 'time', header: 'Time', isFilter: true, filterType: 'timeonly' },
      { field: 'flightPhase', header: 'Phase of Flight', isFilter: true },
      {
        field: 'flightLevel',
        header: 'Flight Level or Attitude',
        isFilter: true,
      },
      {
        field: 'duration',
        header: 'Duration',
        isFilter: true,
        filterType: 'timeonly',
      },

      {
        field: 'gpsLossForms',
        header: 'GPS Loss Types',
        isFilter: false,
        template: this.gpsLossFormsColumnTemplate(),
      },
    ]);
  }

  getAllGpsLossForms() {
    this.tableLoading.set(true);

    this.gpsLossFormsService
      .getAllGpsLossForms(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        this.tableFilters(),
      )
      .subscribe({
        next: (response: IGpsLossFormsResponse) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,

            arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
          }));

          this.gpsLossFormsContentData.set(formattedData);
          this.gpsLossFormsData.set(response);

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

          this.getAllGpsLossForms();
        }
      });
  }

  onChangeSearch(value: string) {
    this.searchInputValue.set(value.toUpperCase());
    this.currentPage.set(0);
    this.customTableComponent().resetTableFirstValue();
    this.getAllGpsLossForms();
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

      firstPointName:
        event.filters?.firstPointName && event.filters?.firstPointName[0].value,

      lastPointName:
        event.filters?.lastPointName && event.filters?.lastPointName[0].value,

      time: event.filters?.time && event.filters?.time[0].value,

      flightPhase:
        event.filters?.flightPhase && event.filters?.flightPhase[0].value,
      flightLevel:
        event.filters?.flightLevel && event.filters?.flightLevel[0].value,
      duration: event.filters?.duration && event.filters?.duration[0].value,
    });
    console.log(this.tableFilters());

    this.getAllGpsLossForms();
  }

  onGpsLossFormsShow(row: IGpsLossFormContentData) {
    this.selectedRow.set(row);
    this.showModal.set(true);
  }

  get modalVisible() {
    return this.showModal();
  }
  set modalVisible(value: boolean) {
    this.showModal.set(value);
  }
}
