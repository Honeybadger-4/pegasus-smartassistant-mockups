import {
  Component,
  OnInit,
  signal,
  viewChild,
  inject,
  ElementRef,
} from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import moment from 'moment';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { LoadSheetService } from '@shared/services/load-sheet.service';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import {
  ILoadSheetResponse,
  ILoadSheetContentData,
} from '@shared/models/load-sheet-response.model';
import { CgLimitsDialogComponent } from '../../components/cg-limits-dialog/cg-limits-dialog.component';
import { LoadAndTrimSheetComponent } from 'src/app/components/load-and-trim-sheet/load-and-trim-sheet.component';
import { LmcDetailsModalComponent } from 'src/app/components/lmc-details-modal/lmc-details-modal.component';
import { ILoadSheetModalsResponse } from '@shared/models/load-sheet-modals-response';

import { Chip } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

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
    LoadAndTrimSheetComponent,
    CgLimitsDialogComponent,
    LmcDetailsModalComponent,
  ],
  templateUrl: './load-sheet.component.html',
  styleUrls: ['./load-sheet.component.scss'],
})
export class LoadSheetComponent implements OnInit {
  // table & filter
  customTableComponent = viewChild.required(CustomTableComponent);
  searchInput = viewChild.required<ElementRef>('searchInput');
  statusColumnTemplate = viewChild.required('statusColumnTemplate');
  loadSheetColumnTemplate = viewChild.required('loadSheetColumnTemplate');
  cgLimitsColumnTemplate = viewChild.required('cgLimitsColumnTemplate');
  lmcColumnTemplate      = viewChild.required('lmcColumnTemplate');

  // signals
  columns               = signal<Column[]>([]);
  loadSheetData         = signal<ILoadSheetResponse | null>(null);
  loadSheetContentData  = signal<ILoadSheetContentData[] | null>(null);

  searchInputValue      = signal<string>('');
  currentPage           = signal<number>(0);
  currentRows           = signal<number>(10);
  tableFilters          = signal<any>({});
  tableLoading          = signal<boolean>(false);

  // Load & Trim Sheet modal
  selectedLoadSheetRowData = signal<ILoadSheetContentData | null>(null);
  showLoadSheetModal       = signal<boolean>(false);

  // LMC modal
  selectedLmcRowData = signal<ILoadSheetModalsResponse | null>(null);
  showLmcModal       = signal<boolean>(false);

  // service
  loadSheetService = inject(LoadSheetService);



  loadSheetModal = signal<boolean>(false);
  cgLimitsDialogVisible = signal<boolean>(false);
  selectedRowData = signal<ILoadSheetContentData | null>(null);

  ngOnInit() {
    this.defineColumn();
    this.setupSearchListener();
    this.getAllLoadSheet();
  }

  defineColumn() {
    this.columns.set([
      { field: 'acReg',        header: 'Aircraft',                isFilter: true },
      { field: 'flightNo',     header: 'Flight No',               isFilter: true },
      { field: 'depPort',      header: 'Departure Port',          isFilter: true },
      { field: 'depDateTime',  header: 'Departure Date', filterType: 'datepicker', isFilter: true },
      { field: 'arrPort',      header: 'Arrival Port',            isFilter: true },
      { field: 'arrDateTime',  header: 'Arrival Date',   filterType: 'datepicker', isFilter: true },
      { field: 'version',      header: 'Version',                  isFilter: true },
      { field: 'preparedBy',   header: 'Prepared By (load sheet)',isFilter: true },
      { field: 'checkedBy',    header: 'Checked By (load sheet)', isFilter: true },
      { field: 'responsibleUser', header: 'Responsible User',     isFilter: true },
      {
        field: 'status',
        header: 'Status',
        isFilter: true,
        filterType: 'selectbox',
        filterOptions: [
          { label: 'Created',   value: 'LOADSHEET_CREATED' },
          { label: 'Delivered', value: 'LOADSHEET_DELIVERED' },
          { label: 'Declined',  value: 'LOADSHEET_DECLINED' },
          { label: 'Replaced',  value: 'LOADSHEET_REPLACED' },
          { label: 'Approved',  value: 'LOADSHEET_APPROVED' },
        ],
        template: this.statusColumnTemplate(),
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
      },

      {
        field: 'cgLimits',
        header: 'CG Limits',
        isFilter: false,
        template: this.cgLimitsColumnTemplate(),
      },
      { field: 'approved',  header: 'Approved Date', filterType: 'datepicker', isFilter: true },
      { field: 'replaced',  header: 'Replaced Date', filterType: 'datepicker', isFilter: true },
      { field: 'declined',  header: 'Declined Date', filterType: 'datepicker', isFilter: true },
      { field: 'loadSheet', header: 'Load Sheet', isFilter: false, template: this.loadSheetColumnTemplate() },
      { field: 'lmc',       header: 'LMC',        isFilter: false, template: this.lmcColumnTemplate() },
      { field: 'cgLimits',  header: 'CG Limits',  isFilter: false,template: this.cgLimitsColumnTemplate() },
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
          const formatted = response.content.map(item => ({
            ...item,
            depDateTime: item.depDateTime  ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm') : null,
            arrDateTime: item.arrDateTime  ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm') : null,
            approved:    item.approved     ? moment(item.approved).format('DD/MM/YYYY - HH:mm')     : null,
            replaced:    item.replaced     ? moment(item.replaced).format('DD/MM/YYYY - HH:mm')     : null,
            declined:    item.declined     ? moment(item.declined).format('DD/MM/YYYY - HH:mm')     : null,
          })) as ILoadSheetContentData[];

          this.loadSheetContentData.set(formatted);
          this.loadSheetData.set(response);
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
    this.currentPage.set(event.first / event.rows);
    this.currentRows.set(event.rows);
    this.tableFilters.set({
      acReg:      event.filters?.acReg?.[0]?.value,
      flightNo:   event.filters?.flightNo?.[0]?.value,
      depPort:    event.filters?.depPort?.[0]?.value,
      depDate:    event.filters?.depDateTime?.[0]?.value,
      version:    event.filters?.version?.[0]?.value,
      preparedBy: event.filters?.preparedBy?.[0]?.value,
      checkedBy:  event.filters?.checkedBy?.[0]?.value,
      responsibleUser: event.filters?.responsibleUser?.[0]?.value,
      status:     event.filters?.status?.[0]?.value,
      approved:   event.filters?.approved?.[0]?.value,
      replaced:   event.filters?.replaced?.[0]?.value,
      declined:   event.filters?.declined?.[0]?.value,
      arrPort:    event.filters?.arrPort?.[0]?.value,
      arrDateTime:event.filters?.arrDateTime?.[0]?.value,
    });
    this.getAllLoadSheet();
  }

  // --- Load & Trim Sheet Modal ---
  onLoadSheetShow(row: ILoadSheetContentData) {
    this.selectedLoadSheetRowData.set(row);
    this.showLoadSheetModal.set(true);
  }

  onShowCGLimitsDialog(rowData: ILoadSheetContentData) {
    this.selectedRowData.set(rowData);
    this.cgLimitsDialogVisible.set(true);
  }

  get loadSheetModalVisible() {
    return this.showLoadSheetModal();
  }
  set loadSheetModalVisible(v: boolean) {
    this.showLoadSheetModal.set(v);
  }

  // --- LMC Modal ---
onLmcShow(row: ILoadSheetContentData) {
  this.loadSheetService
    .getLoadSheetModalInfo(row.id!)    
    .subscribe({
      next: (detail: ILoadSheetModalsResponse) => {
        this.selectedLmcRowData.set(detail);
        this.showLmcModal.set(true);
      },
      error: () => {
      }
    });
}


  get lmcModalVisible() {
    return this.showLmcModal();
  }
  set lmcModalVisible(v: boolean) {
    this.showLmcModal.set(v);
  }
}
