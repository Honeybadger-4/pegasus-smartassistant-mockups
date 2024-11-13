import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from "../../components/custom-table/custom-table.component";

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
    CustomTableComponent
],
  templateUrl: './fuel.component.html',
  styleUrl: './fuel.component.scss',
})
export class FuelComponent {
  @ViewChild('fuelOrderCellBodyTemplate', {static: true}) fuelOrderCellBodyTemplate!: TemplateRef<any>
  selectedFuelOrder: string = '';
  selectedDaily: string = '';

  fuelOrderOptions = [
    { label: 'Fuel Order 1', value: 'order1' },
    { label: 'Fuel Order 2', value: 'order2' },
    { label: 'Fuel Order 3', value: 'order3' },
  ];
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
      fuelOrder: 'YES',
      amount: '4800 KG',
    },
    {
      id: '1',
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      fuelOrder: 'YES',
      amount: '4900 KG',
    },
  ];
  columns!: Column[];

  ngOnInit() {
    this.defineMainColumns();
  }

  // Define Columns Operation
  defineMainColumns() {
    this.columns = [
      { field: 'aircraft', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'departure', header: 'Departure' },
      { field: 'arrival', header: 'Arrival' },
      { field: 'fuelOrder', header: 'Fuel Order', template: this.fuelOrderCellBodyTemplate },
      { field: 'amount', header: 'Amount' },
    ];
  }
}
