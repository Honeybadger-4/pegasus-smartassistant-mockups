import { RouteTableHeaderComponent } from '../../components/flight-info/route-table-header/route-table-header.component';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TableModule,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Column } from '@shared/models/columns';
import { TabViewModule } from 'primeng/tabview';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    RouteTableHeaderComponent,
    CommonModule,
    TableModule,
    ButtonModule,
    TabViewModule,
    CustomTableComponent,
  ],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss',
})
export class RouteComponent {
  @ViewChild('expandableTableDocumentsIconTemplate', { static: true })
  expandableTableDocumentsIconTemplate!: TemplateRef<any>;
  // Mock Data
  routeData = [
    {
      id: '0',
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      depPort: 'AYT',
      arrPort: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      user: 'SAWBNCS1',
      gpsLossForm: '+',
      alternateRoute: '-',
    },
    {
      id: '1',
      aircraft: 'TC-A329',
      flightNo: 'PC2004',
      depPort: 'AYT',
      arrPort: 'DUS',
      depDateTime: '23/07/2025 13:30',
      arrDateTime: '23/07/2025 16:30',
      user: 'SAWBNCS2',
      gpsLossForm: '+',
      alternateRoute: '-',
    },
    {
      id: '2',
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      depPort: 'AYT',
      arrPort: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      user: 'SAWBNCS1',
      gpsLossForm: '+',
      alternateRoute: 'LTBJ',
    },
    {
      id: '3',
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      depPort: 'AYT',
      arrPort: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      user: 'SAWBNCS1',
      gpsLossForm: '+',
      alternateRoute: 'LTBJ',
    },
    {
      id: '4',
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      depPort: 'AYT',
      arrPort: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      user: 'SAWBNCS1',
      gpsLossForm: '+',
      alternateRoute: 'LTBJ',
    },
  ];
  detailsData = [
    {
      airway: 'UGB',
      wpt: 'GOBIT',
      mora: '86',
      fl: 'CLB',
      shr: '-',
      avtt: '110',
      wv: '269/02',
      dist: '54',
      rd: '152',
      pf: '152',
      fu: '-1042',
      rf: '-823',
      afDf: '00:00',
      min: '00:00',
      tw: '05:10',
      atDt: '00:00',
      acc: '05:10',
    },
    {
      airway: 'UGB',
      wpt: 'GOBIT',
      mora: '86',
      fl: 'CLB',
      shr: '-',
      avtt: '110',
      wv: '269/02',
      dist: '54',
      rd: '152',
      pf: '152',
      fu: '-1042',
      rf: '-823',
      afDf: '00:00',
      min: '00:00',
      tw: '05:10',
      atDt: '00:00',
      acc: '05:10',
    },
    {
      airway: 'UGB',
      wpt: 'GOBIT',
      mora: '86',
      fl: 'CLB',
      shr: '-',
      avtt: '110',
      wv: '269/02',
      dist: '54',
      rd: '152',
      pf: '152',
      fu: '-1042',
      rf: '-823',
      afDf: '00:00',
      min: '00:00',
      tw: '05:10',
      atDt: '00:00',
      acc: '05:10',
    },
    {
      airway: 'UGB',
      wpt: 'GOBIT',
      mora: '86',
      fl: 'CLB',
      shr: '-',
      avtt: '110',
      wv: '269/02',
      dist: '54',
      rd: '152',
      pf: '152',
      fu: '-1042',
      rf: '-823',
      afDf: '00:00',
      min: '00:00',
      tw: '05:10',
      atDt: '00:00',
      acc: '05:10',
    },
  ];

  // Columns Variable
  mainCols!: Column[];
  detailsCols!: Column[];
  expandedRows = {};

  ngOnInit() {
    this.defineMainColumns();
    this.defineDetailsColumns();
  }

  // Define Columns Operation
  defineMainColumns() {
    this.mainCols = [
      { field: 'aircraft', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'depPort', header: 'Dep Port' },
      { field: 'arrPort', header: 'Arr Port' },
      { field: 'depDateTime', header: 'Dep Date/Time' },
      { field: 'arrDateTime', header: 'Arr Date/Time' },
      { field: 'user', header: 'User' },
      { field: 'gpsLossForm', header: 'GPS Loss Form' },
      { field: 'alternateRoute', header: 'Alternate Route' },
    ];
  }

  defineDetailsColumns() {
    this.detailsCols = [
      { field: 'airway', header: 'Airway' },
      { field: 'wpt', header: 'WPT' },
      { field: 'mora', header: 'MORA' },
      { field: 'fl', header: 'FL' },
      { field: 'shr', header: 'SHR' },
      { field: 'avtt', header: 'AVTT' },
      { field: 'wv', header: 'W/V' },
      { field: 'dist', header: 'DIST' },
      { field: 'rd', header: 'RD' },
      { field: 'pf', header: 'PF' },
      { field: 'fu', header: 'FU' },
      { field: 'rf', header: 'RF' },
      { field: 'afDf', header: 'AF-DF' },
      { field: 'min', header: 'MIN' },
      { field: 'tw', header: 'T/W' },
      { field: 'atDt', header: 'AT-DT' },
      { field: 'acc', header: 'ACC' },
      {field: '', header:'',template:this.expandableTableDocumentsIconTemplate},

    ];
  }

  onRowExpand(event: TableRowExpandEvent) {
    console.log('Expanded: ', event);
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    console.log('Collapsed: ', event);
  }

 
}
