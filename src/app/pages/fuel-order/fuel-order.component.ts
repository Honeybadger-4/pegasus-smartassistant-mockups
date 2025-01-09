import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-fuel',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    CustomTableComponent,
    CalendarModule,
  ],
  templateUrl: './fuel-order.component.html',
  styleUrl: './fuel-order.component.scss',
})
export class FuelOrderComponent {
  columns!: Column[];
  dateRange: Date[] = [];

  fuelData = [
    {
      id: '0',
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      amount: '4800 KG',
    },
    {
      id: '1',
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      amount: '4900 KG',
    },
  ];

  ngOnInit() {
    this.defineColumns();
  }

  defineColumns() {
    this.columns = [
      { field: 'aircraft', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'departure', header: 'Departure' },
      { field: 'arrival', header: 'Arrival' },
      { field: 'depDateTime', header: 'Dep Date/Time' },
      { field: 'arrDateTime', header: 'Arr Date/Time' },
      { field: 'amount', header: 'Amount' },
    ];
  }
}
