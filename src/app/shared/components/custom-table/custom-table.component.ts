import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  input,
  output,
  Output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Column } from '@shared/models/columns';
import { ShowToastService } from '@shared/services/helpers-services/show-toast.service';
import moment from 'moment';

import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-custom-table',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    SelectModule,
    DatePickerModule,
    InputTextModule,
    InputMaskModule,
  ],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
})
export class CustomTableComponent {
  table = viewChild.required<Table>('table');
  showToastService = inject(ShowToastService);

  tableData = input<any>();
  tableColumns = input<Column[]>();
  tableLoading = input<boolean>(false);
  selectionMode = input<'single' | 'multiple' | null>();
  isPaginator = input<boolean>(true);
  totalRecords = input<number>(0);
  noDataFoundMsg = input<string>('No data found.');
  footerTemplate = input<TemplateRef<any> | null>(null);

  lazyLoadEvent = output<any>();
  @Output() selectedCheckbox: EventEmitter<any> = new EventEmitter<any>();
  selectionData: any[] = [];
  rows = 20;
  filterValues: { [key: string]: any } = {};

  selectionChange(event: any) {
    this.selectedCheckbox.emit(event);
  }

  onLazyLoad(event: any) {
    this.updateFilters(event);
    this.lazyLoadEvent.emit(event);
  }

  // Lazy Load tetiklendiğinde even.filters içerisinde boş olan filtreleri filterValues içinde resetler.
  updateFilters(event: any) {
    const filters = event.filters as { [key: string]: { value: any }[] };
    Object.entries(filters).forEach(([key, filterArray]) => {
      // PrimeNG filter yapısı: filterArray = [{ value, matchMode, operator }]
      const filterObj = filterArray[0];

      if (
        filterObj?.value == null ||
        filterObj?.value == undefined ||
        filterObj?.value == ''
      ) {
        this.filterValues[key] = filterObj.value;
      }
    });
  }

  // It resets the table's first value to 0 when needed, triggered from the parent component.
  resetTableFirstValue() {
    if (this.table().first) {
      this.table().first = 0;
    }
  }

  clearSelectionData() {
    this.selectionData = [];
  }

  filterDateControl(selectedDate: any) {
    return moment(selectedDate).format('YYYY-MM-DD');
  }

  // Time filter operations
  onTimeFilterComplete(
    value: string | null | undefined,
    filterCallback: Function,
  ) {
    if (this.isValidTime24Format(value)) {
      filterCallback(value); // filtre uygula
    } else {
      console.warn('Invalid time format:', value);
      this.showToastService.showErrorToast(
        'Invalid time format. Please use HH:mm (24-hour) format.',
      );
    }
  }

  isValidTime24Format(value: string | null | undefined): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(value || '');
  }
}
