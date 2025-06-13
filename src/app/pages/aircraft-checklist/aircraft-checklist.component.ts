import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
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
import { FlightInformationService } from '@shared/services/flight-information.service';
import { IAircraftChecklistResponse } from '@shared/models/aircraft-checklist-response.model';
import moment from 'moment';

@Component({
  selector: 'app-aircraft-checklist',
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './aircraft-checklist.component.html',
  styleUrl: './aircraft-checklist.component.scss',
})
export class AircraftChecklistComponent implements OnInit {
  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<any>;
  customTableComponent = viewChild.required(CustomTableComponent);
  searchInput = viewChild.required<ElementRef>('searchInput');
  flightInformationService = inject(FlightInformationService);

  aircraftChecklistData = signal<IAircraftChecklistResponse | null>(null);

  aircraftChecklistContentData = signal<
    IAircraftChecklistResponse['content'] | null
  >(null);

  searchInputValue = signal<string>('');

  columns = signal<Column[]>([]);

  currentPage = signal<number>(0);
  currentRows = signal<number>(10);

  tableLoading = signal<boolean>(false);
  tableFilters = signal<any>({});

  ngOnInit(): void {
    this.defineColumns();
    this.setupSearchListener();
  }

  defineColumns() {
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
      { field: 'arrPort', header: 'Arrival Port', isFilter: true },
      {
        field: 'arrDateTime',
        header: 'Arrival Date',
        isFilter: true,
        filterType: 'datepicker',
      },

      {
        field: 'melItems',
        header: 'MEL Items',
        isFilter: false,
        template: this.statusTemplate,
      },
      {
        field: 'dailyCheck',
        header: 'Daily Check',
        isFilter: false,
        template: this.statusTemplate,
      },

      {
        field: 'defferedItems',
        header: 'Deffered Items',
        isFilter: false,
        template: this.statusTemplate,
      },
      {
        field: 'preflightCheck',
        header: 'Preflight Check',
        isFilter: false,
        template: this.statusTemplate,
      },
      {
        field: 'fluidUplift',
        header: 'Fluid Uplift',
        isFilter: false,
        template: this.statusTemplate,
      },

      {
        field: 'securitySearch',
        header: 'Security Search',
        isFilter: false,
        template: this.statusTemplate,
      },
      { field: 'signature', header: 'Signature', isFilter: false },
      { field: 'confirmedBy', header: 'Confirmed by', isFilter: true },
      {
        field: 'confirmedDateTime',
        header: 'Confirmed Date',
        isFilter: true,
        filterType: 'datepicker',
      },
    ]);
  }

  getAircraftCheckList() {
    this.tableLoading.set(true);
    this.flightInformationService
      .getAircraftCheckList(
        this.currentPage(),
        this.currentRows(),

        this.searchInputValue(),
        this.tableFilters(),
      )
      .subscribe({
        next: (response: IAircraftChecklistResponse) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            confirmedDateTime: item.confirmedDateTime
              ? moment(item.confirmedDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
          }));

          this.aircraftChecklistData.set(response);
          this.aircraftChecklistContentData.set(formattedData);

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

          this.getAircraftCheckList();
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
      aircraftReg:
        event.filters?.aircraftReg && event.filters?.aircraftReg[0].value,
      flightNo: event.filters?.flightNo && event.filters?.flightNo[0].value,
      depPort: event.filters?.depPort && event.filters?.depPort[0].value,
      depDate:
        event.filters?.depDateTime && event.filters?.depDateTime[0].value,
      arrPort: event.filters?.arrPort && event.filters?.arrPort[0].value,
      arrDate:
        event.filters?.arrDateTime && event.filters?.arrDateTime[0].value,
      confirmedBy:
        event.filters?.confirmedBy && event.filters?.confirmedBy[0].value,
      confirmedDate:
        event.filters?.confirmedDateTime &&
        event.filters?.confirmedDateTime[0].value,
    });
    console.log(this.tableFilters());

    this.getAircraftCheckList();
  }
}
