import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Column } from '@shared/models/columns';
import { IPersonalChecklistsResponse } from '@shared/models/personal-checklists-response.model';
import { FlightInformationService } from '@shared/services/flight-information.service';
import { Chip } from 'primeng/chip';
import moment from 'moment';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-personal-checklists',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    Chip,
  ],
  templateUrl: './personal-checklists.component.html',
  styleUrl: './personal-checklists.component.scss',
})
export class PersonalChecklistsComponent implements OnInit {
  statusColumnTemplate = viewChild.required('statusColumnTemplate');

  customTableComponent = viewChild.required(CustomTableComponent);

  flightInformationService = inject(FlightInformationService);
  searchInput = viewChild.required<ElementRef>('searchInput');

  personalChecklistsData = signal<IPersonalChecklistsResponse | null>(null);
  personalChecklistsContentData = signal<
    IPersonalChecklistsResponse['content'] | null
  >(null);

  columns = signal<Column[]>([]);
  currentPage = signal<number>(0);
  currentRows = signal<number>(10);
  tableLoading = signal<boolean>(false);
  tableFilters = signal<any>({});

  currentSortBy = signal<string>('depDateTime');
  currentSortDir = signal<string>('desc');
  searchInputValue = signal<string>('');

  ngOnInit() {
    this.defineColumns();
    this.setupSearchListener();
  }

  defineColumns() {
    this.columns.set([
      { field: 'aircraftReg', header: 'Aircraft', isFilter: true },
      { field: 'flightNo', header: 'Flight No', isFilter: true },
      { field: 'depDateTime', header: 'Dep Date - Time' },
      { field: 'arrDateTime', header: 'Approve Date - Time' },
      { field: 'checklistConfirmed', header: 'Approved By', isFilter: true },
      {
        field: 'status',
        header: 'Status',
        isFilter: true,
        template: this.statusColumnTemplate(),
      },
    ]);
  }

  getPersonalChecklists() {
    this.tableLoading.set(true);
    this.flightInformationService
      .getPersonalCheckList(
        this.currentPage(),
        this.currentRows(),
        this.currentSortBy(),
        this.currentSortDir(),
        this.searchInputValue(),
        this.tableFilters(),
      )
      .subscribe({
        next: (response: IPersonalChecklistsResponse) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depDateTime: moment(item.depDateTime).format('DD/MM/YYYY - HH:mm'),
            arrDateTime: moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm'),
          }));

          this.personalChecklistsData.set(response);
          this.personalChecklistsContentData.set(formattedData);

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

          this.getPersonalChecklists();
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

    this.currentSortBy.set(event.sortField || 'depDateTime');
    this.currentSortDir.set(event.sortOrder === 1 ? 'asc' : 'desc');

    this.tableFilters.set({
      aircraftReg:
        event.filters?.aircraftReg && event.filters?.aircraftReg[0].value,
      status: event.filters?.status && event.filters?.status[0].value,
      flightNo: event.filters?.flightNo && event.filters?.flightNo[0].value,
      checklistConfirmedBy:
        event.filters?.checklistConfirmedBy &&
        event.filters?.checklistConfirmedBy[0].value,
    });

    this.getPersonalChecklists();
  }
}
