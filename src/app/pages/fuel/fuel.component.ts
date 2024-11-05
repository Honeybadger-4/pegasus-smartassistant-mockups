import { Component } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {
  TableModule,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Column } from '@shared/models/columns';
import { TabViewModule } from 'primeng/tabview';


@Component({
  selector: 'app-fuel',
  standalone: true,
  imports: [CommonModule, DropdownModule, IconFieldModule, InputIconModule, InputTextModule, FormsModule, TableModule, ButtonModule, TabViewModule,],
  templateUrl: './fuel.component.html',
  styleUrl: './fuel.component.scss'
})
export class FuelComponent {
  selectedFuelOrder: string = '';
  selectedDaily: string = '';

  fuelOrderOptions = [
    { label: 'Fuel Order 1', value: 'order1' },
    { label: 'Fuel Order 2', value: 'order2' },
    { label: 'Fuel Order 3', value: 'order3' }
  ];

  dailyOptions = [
    { label: 'Daily 1', value: 'daily1' },
    { label: 'Daily 2', value: 'daily2' },
    { label: 'Daily 3', value: 'daily3' }
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

  expandedTableData: any[] = [];

  // Columns Variable
  mainCols!: Column[];
  expandedTableColumns!: Column[];
  // /Columns Variable

  expandedRows = {};
  activeTabIndex: number = 0;

  ngOnInit() {
    this.defineMainColumns();
  }

  // Define Columns Operation
  defineMainColumns() {
    this.mainCols = [
      { field: 'aircraft', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'departure', header: 'Departure' },
      { field: 'arrival', header: 'Arrival' },
      { field: 'fuelOrder', header: 'Fuel Order' },
      { field: 'amount', header: 'Amount' },
    ];
  }

  onRowExpand(event: TableRowExpandEvent) {
    console.log('Expanded: ', event);
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    console.log('Collapsed: ', event);
  }



}




