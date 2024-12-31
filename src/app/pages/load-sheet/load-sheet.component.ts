import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { Column } from '@shared/models/columns';

import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { LoadSheetService } from '@shared/services/load-sheet.service';
import {
  ILoadSheetResponse,
  ILoadSheetTableData,
} from '@shared/models/load-sheet-response.model';

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
  @ViewChild('statusCellBodyTemplate', { static: true })
  statusCellBodyTemplate!: TemplateRef<any>;
  @ViewChild('previewCellBodyTemplate', { static: true })
  previewCellBodyTemplate!: TemplateRef<any>;
  @ViewChild('downloadCellBodyTemplate', { static: true })
  downloadCellBodyTemplate!: TemplateRef<any>;

  loadSheetService = inject(LoadSheetService);


  loadSheetData = signal<ILoadSheetResponse | null>(null);
  loadSheetTableData = signal<ILoadSheetTableData[]>([]);

  selectedPeriod = '';
  approvedValue = 76;
  declinedValue = 24;

  periodOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];
  columns: Column[] = [];

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

  // getLoadSheet(page: number, size: number) {
  //   this.loadSheetService
  //     .getLoadSheet(this.selectedPeriod, page, size)
  //     .subscribe({
  //       next: (response) => {
  //         this.loadSheetData.set(response);
  //         this.loadSheetTableData.set(response.content);
  //       },
  //       error: (error) => {
  //         console.error(error);
  //       },
  //     });
  // }

  getLoadSheet() {
    this.loadSheetService
      .getLoadSheet('MONTHLY', 0, 3)
      .subscribe((response) => {
        this.loadSheetTableData.set(response.loadSheets.content);
      });
  }
}
