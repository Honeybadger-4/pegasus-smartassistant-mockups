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
import { Chip } from 'primeng/chip';
import moment from 'moment';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { ILoadSheetResponse } from '@shared/models/load-sheet-response.model';
import { LoadSheetService } from '@shared/services/load-sheet.service';

@Component({
  selector: 'app-load-sheet',
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    Chip,
  ],
  templateUrl: './load-sheet.component.html',
  styleUrl: './load-sheet.component.scss',
})
export class LoadSheetComponent implements OnInit {
  customTableComponent = viewChild.required(CustomTableComponent);
  loadSheetColumnTemplate = viewChild.required('loadSheetColumnTemplate');
  statusColumnTemplate = viewChild.required('statusColumnTemplate');
  searchInput = viewChild.required<ElementRef>('searchInput');

  loadSheetService = inject(LoadSheetService);

  columns = signal<Column[]>([]);
  loadSheetData = signal<ILoadSheetResponse[] | null>(null);
  loadSheetTotal = signal<number>(0);

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
      {
        field: 'depDateTime',
        header: 'Departure Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      { field: 'version', header: 'Version', isFilter: true },
      {
        field: 'preparedBy',
        header: 'Prepared By (load sheet)',
        isFilter: true,
      },
      { field: 'checkedBy', header: 'Checked By (load sheet)', isFilter: true },
      { field: 'responsibleUser', header: 'Responsible User', isFilter: true },
      {
        field: 'status',
        header: 'Status',
        isFilter: true,
        template: this.statusColumnTemplate(),
        filterType: 'selectbox',
        filterOptions: [
          { label: 'Waiting for Approve', value: 'NEW' },
          { label: 'Approved', value: 'APPROVED' },
          { label: 'Submitted', value: 'SUBMITTED' },
          { label: 'Declined', value: 'DECLINED' },
          { label: 'Replaced', value: 'REPLACED' },
        ],
      },

      {
        field: 'approved',
        header: 'Approved Date',
        isFilter: true,
        filterType: 'datepicker',
      },

      {
        field: 'replaced',
        header: 'Replaced Date',
        isFilter: true,
        filterType: 'datepicker',
      },

      {
        field: 'declined',
        header: 'Declined Date',
        isFilter: true,
        filterType: 'datepicker',
      },

      {
        field: 'loadSheet',
        header: 'Load Sheet',
        isFilter: false,
        template: this.loadSheetColumnTemplate(),
      },
      {
        field: 'lmc',
        header: 'LMC',
        isFilter: false,
        template: this.loadSheetColumnTemplate(),
      },

      {
        field: 'cgLimits',
        header: 'CG Limits',
        isFilter: false,
        template: this.loadSheetColumnTemplate(),
      },
    ]);
  }

  getAllLoadSheet() {
    this.tableLoading.set(true);

    this.loadSheetService
      .getAllLoadSheet(
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
            approved: item.approved
              ? moment(item.approved).format('DD/MM/YYYY - HH:mm')
              : null,
            replaced: item.replaced
              ? moment(item.replaced).format('DD/MM/YYYY - HH:mm')
              : null,
            declined: item.declined
              ? moment(item.declined).format('DD/MM/YYYY - HH:mm')
              : null,
          }));

          this.loadSheetData.set(formattedData);
          this.loadSheetTotal.set(response.totalElements);
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

          this.getAllLoadSheet();
        }
      });
  }

  onChangeSearch(value: string) {
    this.searchInputValue.set(value.toUpperCase());
    this.currentPage.set(0);
    this.customTableComponent().resetTableFirstValue();
    this.getAllLoadSheet();
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
      version: event.filters?.version && event.filters?.version[0].value,
      preparedBy:
        event.filters?.preparedBy && event.filters?.preparedBy[0].value,
      checkedBy: event.filters?.checkedBy && event.filters?.checkedBy[0].value,
      responsibleUser:
        event.filters?.responsibleUser &&
        event.filters?.responsibleUser[0].value,
      status: event.filters?.status && event.filters?.status[0].value,
      approved: event.filters?.approved && event.filters?.approved[0].value,
      replaced: event.filters?.replaced && event.filters?.replaced[0].value,
      declined: event.filters?.declined && event.filters?.declined[0].value,
    });
    console.log(this.tableFilters());

    this.getAllLoadSheet();
  }

  onFlightPlansShow(rowData: ILoadSheetResponse) {
    console.log('Selected row:', rowData);
  }
}
