import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { SliderModule } from 'primeng/slider';
import { LoadSheetService } from '@shared/services/load-sheet.service';
import {
  ILoadSheetResponse,
  ILoadSheetTableData,
} from '@shared/models/load-sheet-response.model';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { LoadAndTrimSheetComponent } from '../../components/load-and-trim-sheet/load-and-trim-sheet.component';
import moment from 'moment';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-load-sheet',
  imports: [
    CommonModule,
    FormsModule,
    SliderModule,
    CustomTableComponent,
    DatePickerModule,
    LoadAndTrimSheetComponent,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
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
  @ViewChild('downloadCellBodyTemplate', { static: true })
  downloadCellBodyTemplate!: TemplateRef<any>;
  formBuilder = inject(FormBuilder);

  loadSheetService = inject(LoadSheetService);
  columns: Column[] = [];
  dateRange: Date[] = [];
  currentPage = 0;
  currentRows = 20;
  isDialogVisible = false;
  filterFormGroup!: FormGroup;
  tableLoading: boolean = false;

  loadSheetData = signal<ILoadSheetResponse | null>(null);
  loadSheetTableData = signal<ILoadSheetTableData[]>([]);
  loadAndTrimSheetData = signal<ILoadSheetTableData | null>(null);
  approvedValue = signal<number>(0);
  declinedValue = signal<number>(0);

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
      { field: 'date', header: 'Date' },
      { field: 'aircraftReg', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'depPort', header: 'Departure' },
      { field: 'arrPort', header: 'Arrival' },
      { field: 'depDateTime', header: 'Dep Date/Time' },
      { field: 'arrDateTime', header: 'Arr Date/Time' },
      {
        field: 'status',
        header: 'Status',
        template: this.statusCellBodyTemplate,
      },
      { field: 'username', header: 'Username' },
      { field: '', header: '', template: this.previewCellBodyTemplate },
      { field: '', header: '', template: this.downloadCellBodyTemplate },
    ];
  }

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
          this.loadSheetData.set(response);
          this.loadSheetTableData.set(response.loadSheets.content);
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

  onFilterSubmit() {
    this.getLoadSheet();
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getLoadSheet();
  }

  dateRangeDefaultValue() {
    const endDate = moment();
    const startDate = moment().subtract(3, 'days');

    return [startDate.toDate(), endDate.toDate()];
  }

  toggleLoadAndTrimSheetDialogVisible(
    rowData: ILoadSheetTableData | null = null,
  ) {
    this.isDialogVisible = !this.isDialogVisible;
    this.loadAndTrimSheetData.set(rowData);
  }
}
