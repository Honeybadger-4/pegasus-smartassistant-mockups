import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BoeingInfoComponent } from 'src/app/components/logbook-dashboard/boeing-info/boeing-info.component';
import { AirbusInfoComponent } from 'src/app/components/logbook-dashboard/airbus-info/airbus-info.component';

import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { Column } from '@shared/models/columns';
import { LogbookService } from '@shared/services/logbook.service';
import { ILogbookSummaryResponse } from '@shared/models/logbook-summary-response.model';


@Component({
  selector: 'app-logbook',
  standalone: true,
  imports: [
    // BoeingInfoComponent,
    // AirbusInfoComponent,
    DropdownModule,
    CommonModule,
    FormsModule,
    SliderModule,
    CustomTableComponent
  ],
  templateUrl: './logbook.component.html',
  styleUrl: './logbook.component.scss',
})
export class LogbookComponent {
  @ViewChild('monthColumnsTemplate', {static: true}) monthColumnsTemplate!: TemplateRef<any>;
  @ViewChild('dutyColumnsTemplate', {static: true}) dutyColumnsTemplate!: TemplateRef<any>;
  @ViewChild('linkedNextPageTemplate', {static: true}) linkedNextPageTemplate!: TemplateRef<any>;
  logbookService = inject(LogbookService);

  tableLoading = false;
  logbookSummaryData = signal<ILogbookSummaryResponse | null>(null);
  boeingData = signal<ILogbookSummaryResponse['boeingSummary'] | null>(null);
  airbusData = signal<ILogbookSummaryResponse['airbusSummary'] | null>(null);
  trainingData = signal<ILogbookSummaryResponse['trainingSummary'] | null>(null);

  columns!: Column[];

  selectedYear!: number;
  yearOptions = [
    { label: '2022', value: 2022 },
    { label: '2023', value: 2023 },
    { label: '2024', value: 2024 },
  ];

  ngOnInit() {
    this.defineColumns();

    const today = new Date();
    //this.selectedYear = today.getFullYear();
    this.selectedYear = 2024;

    this.getLogbookSummary();
  }

  defineColumns() {
    this.columns = [
      {field: "yearMonth", header: "Month", template: this.monthColumnsTemplate},
      {field: "dutyCount", header: "Duty", template: this.dutyColumnsTemplate},
      {field: "", header: "", template: this.linkedNextPageTemplate}
    ]
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
        console.log(error);
        this.tableLoading = false;
      }
    })
  }

  onNextPage(rowData: any) {
    console.log(rowData);
  }
}
