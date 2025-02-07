import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { LoadAndTrimSheetComponent } from '../../components/load-and-trim-sheet/load-and-trim-sheet.component';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { LoadSheetService } from '@shared/services/load-sheet.service';
import { Column } from '@shared/models/columns';
import {
  ILoadSheetResponse,
  ILoadSheetTableData,
} from '@shared/models/load-sheet-response.model';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import moment from 'moment';

@Component({
  selector: 'app-load-sheet',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadAndTrimSheetComponent,
    CustomTableComponent,
    SliderModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DatePickerModule,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './load-sheet.component.html',
  styleUrl: './load-sheet.component.scss',
})
export class LoadSheetComponent {
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;
  @ViewChild('statusCellBodyTemplate', { static: true })
  statusCellBodyTemplate!: TemplateRef<any>;
  @ViewChild('previewCellBodyTemplate', { static: true })
  previewCellBodyTemplate!: TemplateRef<any>;

  filterFormGroup!: FormGroup;
  columns: Column[] = [];
  dateRange: Date[] = [];
  currentPage = 0;
  currentRows = 20;
  isDialogVisible = false;
  tableLoading: boolean = false;

  loadSheetData = signal<ILoadSheetResponse | null>(null);
  loadSheetTableData = signal<ILoadSheetTableData[]>([]);
  loadAndTrimSheetData = signal<ILoadSheetTableData | null>(null);
  approvedValue = signal<number>(0);
  declinedValue = signal<number>(0);

  formBuilder = inject(FormBuilder);
  loadSheetService = inject(LoadSheetService);

  ngOnInit() {
    this.builder();
    this.defineColumn();
    this.getLoadSheet();
  }

  builder() {
    this.filterFormGroup = this.formBuilder.group({
      acReg: [''],
      flightNo: [''],
      depPort: [''],
      arrPort: [''],
      dateRange: [this.dateRangeDefaultValue()],
    });
  }

  defineColumn() {
    this.columns = [
      { field: 'aircraftReg', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'depPort', header: 'Departure' },
      { field: 'arrPort', header: 'Arrival' },
      { field: 'depDateTime', header: 'Dep Date/Time' },
      { field: 'arrDateTime', header: 'Arr Date/Time' },
      { field: 'preparedBy', header: 'Prepared By' },
      { field: 'checkedBy', header: 'Checked By' },
      { field: 'username', header: 'Approved By' },
      { field: 'lmc', header: 'LMC' },
      { field: 'crew', header: 'Crew' },
      { field: 'version', header: 'Version' },
      {
        field: 'status',
        header: 'Status',
        template: this.statusCellBodyTemplate,
      },
      { field: '', header: '', template: this.previewCellBodyTemplate },
    ];
  }

  // API Calls Operations
  getLoadSheet() {
    this.tableLoading = true;

    const formValues = this.filterFormGroup.value;
    const acReg = formValues.acReg?.trim() || null;
    const flightNo = formValues.flightNo?.trim() || null;
    const depPort = formValues.depPort?.trim() || null;
    const arrPort = formValues.arrPort?.trim() || null;
    let startDate = '';
    let endDate = '';

    // Tarih aralığı kontrolü ve formatlama
    if (formValues.dateRange && formValues.dateRange.length === 2) {
      const [start, end] = formValues.dateRange;

      if (start && end) {
        startDate = moment(start).format('YYYY-MM-DD');
        endDate = moment(end).format('YYYY-MM-DD');
      }
    }
    this.loadSheetService
      .getLoadSheet(
        this.currentPage,
        this.currentRows,
        startDate,
        endDate,
        acReg,
        flightNo,
        depPort,
        arrPort,
      )
      .subscribe({
        next: (response) => {
          const formattedData = response.loadSheets.content.map((item) => ({
            ...item,
            depDateTime: moment(item.depDateTime).format('DD/MM/YYYY - HH:mm'),
            arrDateTime: moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm'),
          }));

          this.loadSheetData.set(response);
          this.loadSheetTableData.set(formattedData);
          this.approvedValue.set(response.approvedPercentage);
          this.tableLoading = false;

          if (response.approvedPercentage === 0) {
            this.declinedValue.set(0);
          } else {
            this.declinedValue.set(100 - response.approvedPercentage);
          }
        },
        error: () => {
          this.tableLoading = false;
        },
      });
  }

  // Filter Operations
  dateRangeDefaultValue() {
    const endDate = moment();
    const startDate = moment().subtract(3, 'days');

    return [startDate.toDate(), endDate.toDate()];
  }

  onFilterSubmit() {
    this.getLoadSheet();
  }

  // Other Operations
  toggleLoadAndTrimSheetDialogVisible(
    rowData: ILoadSheetTableData | null = null,
  ) {
    this.isDialogVisible = !this.isDialogVisible;
    this.loadAndTrimSheetData.set(rowData);
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getLoadSheet();
  }
}
