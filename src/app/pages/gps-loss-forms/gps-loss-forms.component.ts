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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { GpsSignalLossService } from '@shared/services/gps-signal-loss.service';
import {
  IGpsLossForm,
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
  ],
  templateUrl: './gps-loss-forms.component.html',
  styleUrl: './gps-loss-forms.component.scss',
})
export class GpsLossFormsComponent implements OnInit {
  customTableComponent = viewChild.required(CustomTableComponent);
  gpsLossFormsColumnTemplate = viewChild.required('gpsLossFormsColumnTemplate');
  statusColumnTemplate = viewChild.required('statusColumnTemplate');
  searchInput = viewChild.required<ElementRef>('searchInput');

  gpsLossFormsService = inject(GpsSignalLossService);

  columns = signal<Column[]>([]);
  gpsLossFormsData = signal<IGpsLossForm[] | null>(null);
  gpsLossFormsTotal = signal<number>(0);

  searchInputValue = signal<string>('');
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
      { field: 'depDateTime', header: 'Departure Date', isFilter: true, filterType: 'datepicker', },
      { field: 'arrPort', header: 'Arrival Port', isFilter: true },
      { field: 'arrDateTime', header: 'Arrival Date', isFilter: true , filterType: 'datepicker',},
      { field: 'firstPointName', header: 'First Point', isFilter: true },
      { field: 'lastPointName', header: 'Last Point', isFilter: true },
      { field: 'time', header: 'Time', isFilter: true },

      {
        field: 'gpsLossForms',
        header: 'GPS Loss Information',
        isFilter: false,
        template: this.gpsLossFormsColumnTemplate(),
      },
    ]);
  }

  getAll() {
    this.tableLoading.set(true);

    this.gpsLossFormsService
      .getAll(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        this.tableFilters(),
      )
      .subscribe({
        next: (response) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,

            arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
          }));

          this.gpsLossFormsData.set(formattedData);
          this.gpsLossFormsTotal.set(response.totalElements);
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

          this.getAll();
        }
      });
  }

  onChangeSearch(value: string) {
    this.searchInputValue.set(value.toUpperCase());
    this.currentPage.set(0);
    this.customTableComponent().resetTableFirstValue();
    this.getAll();
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
    });
    console.log(this.tableFilters());

    this.getAll();
  }

  onGpsLossFormsShow(rowData: IGpsLossForm) {
    console.log('Selected row:', rowData);
  }
}
