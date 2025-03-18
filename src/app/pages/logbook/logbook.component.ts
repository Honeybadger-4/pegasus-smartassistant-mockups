import { Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Column } from '@shared/models/columns';
import { AdminLogbookService } from '@shared/services/admin-logbook.service';
import { ILogbookSummaryResponse } from '@shared/models/logbook-summary-response.model';
import { StateManagement } from '@shared/services/helpers-services/state-management.service';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';

import { SliderModule } from 'primeng/slider';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-logbook',
  imports: [
    SelectModule,
    CommonModule,
    FormsModule,
    SliderModule,
    CustomTableComponent,
  ],
  templateUrl: './logbook.component.html',
  styleUrl: './logbook.component.scss',
})
export class LogbookComponent {
  dutyColumnsTemplate = viewChild.required('dutyColumnsTemplate');
  monthColumnsTemplate = viewChild.required('monthColumnsTemplate');
  linkedNextPageTemplate = viewChild.required('linkedNextPageTemplate');

  router = inject(Router);
  stateManagement = inject(StateManagement);
  adminLogbookService = inject(AdminLogbookService);

  columns = signal<Column[]>([]);
  tableLoading = signal<boolean>(false);

  logbookSummaryData = signal<ILogbookSummaryResponse | null>(null);
  boeingData = signal<ILogbookSummaryResponse['boeingSummary'] | null>(null);
  airbusData = signal<ILogbookSummaryResponse['airbusSummary'] | null>(null);
  trainingData = signal<ILogbookSummaryResponse['trainingSummary'] | null>(
    null,
  );

  currentMonth = signal<string | null>(null);

  selectedYear = signal<number>(0);
  yearOptions = signal<number[] | undefined>(undefined);

  ngOnInit() {
    this.defineColumns();
    this.getAvailableYears();

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    this.currentMonth.set(year + '-' + month);
  }

  defineColumns() {
    this.columns.set([
      {
        field: 'yearMonth',
        header: 'Month',
        template: this.monthColumnsTemplate(),
      },
      {
        field: 'dutyCount',
        header: 'Duty',
        template: this.dutyColumnsTemplate(),
      },
      { field: '', header: '', template: this.linkedNextPageTemplate() },
    ]);
  }

  getLogbookSummary() {
    this.tableLoading.set(true);
    this.adminLogbookService.getLogbookSummary(this.selectedYear()).subscribe({
      next: (response) => {
        this.logbookSummaryData.set(response);
        this.boeingData.set(response.boeingSummary);
        this.airbusData.set(response.airbusSummary);
        this.trainingData.set(response.trainingSummary);
        this.tableLoading.set(false);
      },
      error: () => {
        this.tableLoading.set(false);
      },
    });
  }

  getAvailableYears() {
    this.adminLogbookService.getAvailableYears().subscribe({
      next: (response) => {
        this.yearOptions.set(response);
        this.selectedYear.set(response[0]);
        this.getLogbookSummary();
      },
    });
  }

  onNextPage(rowData?: any, isCurrentMonth = false) {
    this.stateManagement.setState('isLogbookCurrentMonth', isCurrentMonth);
    this.stateManagement.setState('logbookSummaryPage', rowData);
    this.router.navigate(['logbook/crew-list']);
  }
}
