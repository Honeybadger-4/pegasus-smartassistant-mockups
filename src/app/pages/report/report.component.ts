import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CustomTableComponent } from 'src/app/components/custom-table/custom-table.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, CustomTableComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent {
  @ViewChild('checkListCellBodyTemplate', { static: true })
  checkListCellBodyTemplate!: TemplateRef<any>;
  @ViewChild('previewCellBodyTemplate', { static: true })
  previewCellBodyTemplate!: TemplateRef<any>;
  @ViewChild('downloadCellBodyTemplate', { static: true })
  downloadCellBodyTemplate!: TemplateRef<any>;

  selectedPeriod: string = '';
  periodOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];

  columns: Column[] = [];
  reportData = [
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      checkList: 'Approved',
      username: 'SAWBNCS1',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      checkList: 'Approved',
      username: 'SAWBNCS2',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      checkList: 'Approved',
      username: 'SAWBNCS3',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      checkList: 'Approved',
      username: 'SAWBNCS4',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      checkList: 'Approved',
      username: 'SAWBNCS5',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      checkList: 'Approved',
      username: 'SAWBNCS6',
    },
  ];

  ngOnInit() {
    this.defineColumn();
  }

  defineColumn() {
    this.columns = [
      { field: 'aircraft', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'departure', header: 'Departure' },
      { field: 'arrival', header: 'Arrival' },
      {
        field: 'checkList',
        header: 'Checklist',
        template: this.checkListCellBodyTemplate,
      },
      { field: 'username', header: 'Username' },
      { field: '', header: '', template: this.previewCellBodyTemplate },
      { field: '', header: '', template: this.downloadCellBodyTemplate },
    ];
  }
}
