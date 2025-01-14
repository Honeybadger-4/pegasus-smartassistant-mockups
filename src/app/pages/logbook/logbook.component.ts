import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { ILogbookSummaryResponse } from '@shared/models/logbook-summary-response.model';
import { LogbookService } from '@shared/services/logbook.service';
import { Column } from '@shared/models/columns';

import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';

@Component({
    selector: 'app-logbook',
    imports: [
        DropdownModule,
        CommonModule,
        FormsModule,
        SliderModule,
        CustomTableComponent,
    ],
    templateUrl: './logbook.component.html',
    styleUrl: './logbook.component.scss'
})
export class LogbookComponent {
  @ViewChild('monthColumnsTemplate', { static: true })
  monthColumnsTemplate!: TemplateRef<any>;
  @ViewChild('dutyColumnsTemplate', { static: true })
  dutyColumnsTemplate!: TemplateRef<any>;
  @ViewChild('linkedNextPageTemplate', { static: true })
  linkedNextPageTemplate!: TemplateRef<any>;
  router = inject(Router);
  logbookService = inject(LogbookService);

  logbookSummaryData = signal<ILogbookSummaryResponse | null>(null);
  boeingData = signal<ILogbookSummaryResponse['boeingSummary'] | null>(null);
  airbusData = signal<ILogbookSummaryResponse['airbusSummary'] | null>(null);
  trainingData = signal<ILogbookSummaryResponse['trainingSummary'] | null>(
    null,
  );
  yearOptions = signal<number[] | undefined>(undefined);

  columns!: Column[];
  tableLoading = false;
  selectedYear!: number;

  ngOnInit() {
    this.defineColumns();
    this.getAvailableYears();
  }

  defineColumns() {
    this.columns = [
      {
        field: 'yearMonth',
        header: 'Month',
        template: this.monthColumnsTemplate,
      },
      {
        field: 'dutyCount',
        header: 'Duty',
        template: this.dutyColumnsTemplate,
      },
      { field: '', header: '', template: this.linkedNextPageTemplate },
    ];
  }

  getLogbookSummary() {
    this.tableLoading = true;
    this.logbookService.getLogbookSummary(this.selectedYear).subscribe({
      next: (response) => {
        this.logbookSummaryData.set(response);
        this.boeingData.set(response.boeingSummary);
        this.airbusData.set(response.airbusSummary);
        this.trainingData.set(response.trainingSummary);
        this.tableLoading = false;
      },
      error: (error) => {
        this.tableLoading = false;
      },
    });
  }

  getAvailableYears() {
    this.logbookService.getAvailableYears().subscribe({
      next: (response) => {
        this.yearOptions.set(response);
        this.selectedYear = response[0];
        this.getLogbookSummary();
      },
      error: (error) => {},
    });
  }

  onNextPage(rowData: any) {
    this.router.navigate(['logbook/crew-list'], {
      state: { data: rowData },
    });
  }
}
