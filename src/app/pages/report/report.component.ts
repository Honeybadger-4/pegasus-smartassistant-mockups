import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { Column } from '@shared/models/columns';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import moment from 'moment';

@Component({
  selector: 'app-report',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    CustomTableComponent,
    DatePickerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent implements OnInit {
  @ViewChild('checkListCellBodyTemplate', { static: true })
  checkListCellBodyTemplate!: TemplateRef<any>;

  @ViewChild('previewCellBodyTemplate', { static: true })
  previewCellBodyTemplate!: TemplateRef<any>;
  formBuilder = inject(FormBuilder);

  filterFormGroup!: FormGroup;
  dateRange: Date[] = [];

  columns: Column[] = [];
  reportData = [
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      checkList: 'Approved',
      username: 'SAWBNCS1',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      checkList: 'Approved',
      username: 'SAWBNCS2',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      checkList: 'Approved',
      username: 'SAWBNCS3',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      checkList: 'Approved',
      username: 'SAWBNCS4',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      checkList: 'Approved',
      username: 'SAWBNCS5',
    },
    {
      aircraft: 'TC-A329',
      flightNo: 'PC2009',
      departure: 'AYT',
      arrival: 'DUS',
      depDateTime: '22/07/2025 13:30',
      arrDateTime: '22/07/2025 16:30',
      checkList: 'Approved',
      username: 'SAWBNCS6',
    },
  ];

  ngOnInit() {
    this.builder();
    this.defineColumn();
  }

  builder() {
    this.filterFormGroup = this.formBuilder.group({
      aircraft: [''],
      flightNo: [''],
      depPort: [''],
      arrPort: [''],
      dateRange: [this.dateRangeDefaultValue()],
    });
  }

  onFilterSubmit() {}

  defineColumn() {
    this.columns = [
      { field: 'aircraft', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'departure', header: 'Departure' },
      { field: 'arrival', header: 'Arrival' },
      { field: 'depDateTime', header: 'Dep Date/Time' },
      { field: 'arrDateTime', header: 'Arr Date/Time' },
      {
        field: 'checkList',
        header: 'Checklist',
        template: this.checkListCellBodyTemplate,
      },
      { field: 'username', header: 'Username' },
      { field: '', header: '', template: this.previewCellBodyTemplate },
    ];
  }

  dateRangeDefaultValue() {
    const endDate = moment();
    const startDate = moment().subtract(3, 'days');

    return [startDate.toDate(), endDate.toDate()];
  }
}
