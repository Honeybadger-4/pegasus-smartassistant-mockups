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
import { LicenceModalComponent } from '../../components/licence-modal/licence-modal.component';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { LicenceInfoService } from '@shared/services/licence-info.service';
import {
  ILicenceInfoContentData,
  ILicenceInfoResponse,
} from '@shared/models/licence-info-response.model';
import moment from 'moment';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-licence-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    LicenceModalComponent,
  ],
  templateUrl: './licence-info.component.html',
  styleUrl: './licence-info.component.scss',
})
export class LicenceInfoComponent implements OnInit {
  licenceColumnTemplate = viewChild.required('licenceColumnTemplate');
  customTableComponent = viewChild.required(CustomTableComponent);
  searchInput = viewChild.required<ElementRef>('searchInput');

  licenceInfoService = inject(LicenceInfoService);

  searchInputValue = signal<string>('');
  columns = signal<Column[]>([]);
  showLicenceModal = signal<boolean>(false);
  selectedRowData = signal<ILicenceInfoContentData | null>(null);

  licenceInfoData = signal<ILicenceInfoResponse | null>(null);
  licenceInfoContentData = signal<ILicenceInfoResponse['content'] | null>(null);

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
      { field: 'acReg', header: 'Ac Reg', isFilter: true },
      { field: 'flightNo', header: 'Flight No', isFilter: true },
      {
        field: 'depTime',
        header: 'Departure Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'checkedDate',
        header: 'Checked Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      { field: 'checkedBy', header: 'Checked By', isFilter: true },
      {
        field: 'licences',
        header: 'Licences',
        isFilter: false,
        template: this.licenceColumnTemplate(),
      },
    ]);
  }

  getLicenceInfo() {
    this.tableLoading.set(true);
    this.licenceInfoService
      .getLicenceInfo(
        this.currentPage(),
        this.currentRows(),

        this.searchInputValue(),
        this.tableFilters(),
      )
      .subscribe({
        next: (response: ILicenceInfoResponse) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depTime: item.depTime
              ? moment(item.depTime).format('DD/MM/YYYY - HH:mm')
              : '-',
            checkedDate: item.checkedDate
              ? moment(item.checkedDate).format('DD/MM/YYYY - HH:mm')
              : '-',
          }));

          this.licenceInfoContentData.set(formattedData);
          this.licenceInfoData.set(response);

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

          this.getLicenceInfo();
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
      acReg: event.filters?.acReg?.[0]?.value,
      flightNo: event.filters?.flightNo?.[0]?.value,
      checkedBy: event.filters?.checkedBy?.[0]?.value,
      depDate: event.filters?.depTime?.[0]?.value,
      checkedDate: event.filters?.checkedDate?.[0]?.value,
    });
    this.getLicenceInfo();
  }

  onLicenceShow(rowData: ILicenceInfoContentData) {
    this.selectedRowData.set(rowData);
    this.showLicenceModal.set(true);
  }

  get licenceModalVisible() {
    return this.showLicenceModal();
  }

  set licenceModalVisible(value: boolean) {
    this.showLicenceModal.set(value);
  }
}
