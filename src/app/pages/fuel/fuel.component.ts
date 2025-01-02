import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';

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
  ],
  templateUrl: './fuel.component.html',
  styleUrl: './fuel.component.scss',
})
export class FuelComponent {
  columns!: Column[];
  selectedDaily = '';

  periodOptions = [
    { label: 'Daily 1', value: 'daily1' },
    { label: 'Daily 2', value: 'daily2' },
    { label: 'Daily 3', value: 'daily3' },
  ];
  fuelData = [
    {
      id: '0',
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      amount: '4800 KG',
    },
    {
      id: '1',
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
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
      { field: 'amount', header: 'Amount' },
    ];
  }
}
