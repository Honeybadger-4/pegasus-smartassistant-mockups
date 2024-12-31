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
import { DropdownModule } from 'primeng/dropdown';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { SliderModule } from 'primeng/slider';
import { LoadSheetService } from '@shared/services/load-sheet.service';
import {
  ILoadSheetResponse,
  ILoadSheetTableData,
} from '@shared/models/load-sheet-response.model';
import { PERIOD_OPTIONS } from '@shared/constants/global-constant';

@Component({
  selector: 'app-load-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    SliderModule,
    CustomTableComponent,
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

  loadSheetData = signal<ILoadSheetResponse | null>(null);
  loadSheetTableData = signal<ILoadSheetTableData[]>([]);
  currentPage = 0;
  currentRows = 20;
  periodOptions: any;
  selectedPeriod = '';

  approvedValue = 76;
  declinedValue = 24;

  ngOnInit() {
    this.periodOptions = PERIOD_OPTIONS;
    this.selectedPeriod = this.periodOptions[0].value;
    this.defineColumn();
    this.getLoadSheet(this.currentPage, this.currentRows);
  }

  defineColumn() {
    this.columns = [
      { field: 'aircraftReg', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'depPort', header: 'Departure' },
      { field: 'arrPort', header: 'Arrival' },
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

  getLoadSheet(page: number, size: number) {
    this.loadSheetService
      .getLoadSheet(this.selectedPeriod, page, size)
      .subscribe({
        next: (response) => {
          this.loadSheetData.set(response);
          this.loadSheetTableData.set(response.loadSheets.content);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onPeriodChange(event: any) {
    this.currentPage = 0;
    this.customTableComponent.resetTableFirstValue();
    this.getLoadSheet(this.currentPage, this.currentRows);
  }
  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getLoadSheet(page, event.rows);
  }
}
