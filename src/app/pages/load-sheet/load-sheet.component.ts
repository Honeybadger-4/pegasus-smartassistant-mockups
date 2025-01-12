import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-load-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SliderModule,
    CustomTableComponent,
    CalendarModule,
    LoadAndTrimSheetComponent,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
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

  loadSheetService = inject(LoadSheetService);
  columns: Column[] = [];
  dateRange: Date[] = [];
  currentPage = 0;
  currentRows = 20;
  isDialogVisible = false;

  loadSheetData = signal<ILoadSheetResponse | null>(null);
  loadSheetTableData = signal<ILoadSheetTableData[]>([]);
  loadAndTrimSheetData = signal<ILoadSheetTableData | null>(null);
  approvedValue = signal<number>(0);
  declinedValue = signal<number>(0);

  ngOnInit() {
    this.defineColumn();

    const today = moment();
    this.initialDateRangeValue();
    this.getLoadSheet();
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

  initialDateRangeValue() {
    const today = moment();
    this.dateRange = [
      today.clone().subtract(7, 'days').toDate(),
      today.clone().add(7, 'days').toDate(),
    ];
  }

  getLoadSheet() {
    let startDate = '';
    let endDate = '';

    // Tarih aralığı kontrolü ve formatlama
    if (this.dateRange.length === 2) {
      const [start, end] = this.dateRange;

      if (start && end) {
        startDate = moment(start).format('YYYY-MM-DD');
        endDate = moment(end).format('YYYY-MM-DD');
      }
    }

    this.loadSheetService
      .getLoadSheet(startDate, endDate, this.currentPage, this.currentRows)
      .subscribe({
        next: (response) => {
          this.loadSheetData.set(response);
          this.loadSheetTableData.set(response.loadSheets.content);
          this.approvedValue.set(response.approvedPercentage);

          if (response.approvedPercentage === 0) {
            this.declinedValue.set(0);
          } else {
            this.declinedValue.set(100 - response.approvedPercentage);
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getLoadSheet();
  }

  onDateRangeChange(event: Event) {
    const [startDate, endDate] = this.dateRange;

    if (startDate && endDate) {
      this.currentPage = 0;
      this.customTableComponent.resetTableFirstValue();
      this.getLoadSheet();
    }
  }

  toggleLoadAndTrimSheetDialogVisible(
    rowData: ILoadSheetTableData | null = null,
  ) {
    this.isDialogVisible = !this.isDialogVisible;
    this.loadAndTrimSheetData.set(rowData);
  }
}
