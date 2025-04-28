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
  searchInputValue = signal<string>('');

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

  ngOnInit() {
    this.defineColumns();
    this.getPersonalChecklists();
  }

  defineColumns() {
    this.columns.set([
      { field: 'aircraftReg', header: 'Aircraft', isFilter: true },
      { field: 'flightNo', header: 'Flight No', isFilter: true },
      { field: 'depDateTime', header: 'Dep Date - Time', isFilter: true },
      { field: 'arrDateTime', header: 'Approve Date - Time', isFilter: true },
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
      .getPersonalCheckList(this.currentPage(), this.currentRows(), {
        sortBy: this.currentSortBy(),
        sortDir: this.currentSortDir(),
        ...this.tableFilters(),
      })
      .subscribe({
        next: (response: IPersonalChecklistsResponse) => {
          this.personalChecklistsData.set(response);
          this.personalChecklistsContentData.set(response.content);
          this.tableLoading.set(false);
        },
        error: () => {
          this.tableLoading.set(false);
        },
      });
  }

  onChangeSearch(value: string) {}

  lazyLoadEvent(event: any) {
    const page = event.first / event.rows;
    this.currentPage.set(page);
    this.currentRows.set(event.rows);

    this.currentSortBy.set(event.sortField || 'depDateTime');
    this.currentSortDir.set(event.sortOrder === 1 ? 'asc' : 'desc');

    this.tableFilters.set({
      aircraftReg: event.filters?.aircraftReg?.value,
      status: event.filters?.status?.value,
      flightNo: event.filters?.flightNo?.value,
      checklistConfirmedBy: event.filters?.checklistConfirmedBy?.value,
      depDateTime: event.filters?.depDateTime?.value,
      arrDateTime: event.filters?.arrDateTime?.value,
    });

    this.getPersonalChecklists();
  }
}
