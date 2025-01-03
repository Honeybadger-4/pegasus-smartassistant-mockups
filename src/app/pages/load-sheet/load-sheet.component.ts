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
  isDialogVisible = true; 


  loadSheetData = signal<ILoadSheetResponse | null>(null);
  loadSheetTableData = signal<ILoadSheetTableData[]>([]);
  approvedValue = signal<number>(0);
  declinedValue = signal<number>(0);

  ngOnInit() {
    this.defineColumn();
    this.getLoadSheet();
  }

  defineColumn() {
    this.columns = [
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
    console.log(1);
    let startDate = '';
    let endDate = '';

    if ((this.dateRange.length == 2)) {
      startDate = this.dateRange[0]?.toISOString();
      endDate = this.dateRange[1]?.toISOString();
    }

    this.loadSheetService
      .getLoadSheet(startDate, endDate, this.currentPage, this.currentRows)
      .subscribe({
        next: (response) => {
          this.loadSheetData.set(response);
          this.loadSheetTableData.set(response.loadSheets.content);
          this.approvedValue.set(response.approvedPercentage);
          this.declinedValue.set(100 - response.approvedPercentage);
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
    console.log(this.dateRange);
    if (!this.dateRange || this.dateRange.length < 2) {
      console.warn('Date range is not selected');
      return;
    }

    this.currentPage = 0;
    this.customTableComponent.resetTableFirstValue();
    this.getLoadSheet();
  }

  toggleDialog() {
    this.isDialogVisible = !this.isDialogVisible;
  }
  
}
