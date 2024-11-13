import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { CustomTableComponent } from "../../components/custom-table/custom-table.component";

@Component({
  selector: 'app-load-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    SliderModule,
    CustomTableComponent
],
  templateUrl: './load-sheet.component.html',
  styleUrl: './load-sheet.component.scss',
})
export class LoadSheetComponent {
  @ViewChild('statusCellBodyTemplate', {static: true}) statusCellBodyTemplate!: TemplateRef<any>
  @ViewChild('previewCellBodyTemplate', {static: true}) previewCellBodyTemplate!: TemplateRef<any>
  @ViewChild('downloadCellBodyTemplate', {static: true}) downloadCellBodyTemplate!: TemplateRef<any>

  selectedPeriod: string = '';
  approvedValue: number = 76;
  declinedValue: number = 24;

  periodOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];

  columns: Column[] = [];
  loadSheetData = [
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      status: 'Approved',
      username: 'SAWBNCS1',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      status: 'Declined',
      username: 'SAWBNCS2',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      status: 'Sent',
      username: 'SAWBNCS3',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      status: 'Not Sent',
      username: 'SAWBNCS4',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      status: 'Sent',
      username: 'SAWBNCS5',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      status: 'Not Sent',
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
      { field: 'status', header: 'Status', template: this.statusCellBodyTemplate },
      { field: 'username', header: 'Username' },
      { field: '', header: '', template: this.previewCellBodyTemplate},
      { field: '', header: '', template: this.downloadCellBodyTemplate}
    ];
  }
}
