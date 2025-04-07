import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  signal,
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
import { TripInfoService } from '@shared/services/trip-info.service';
import {
  ITripInfoResponse,
  ITripInfoTableData,
} from '@shared/models/trip-info-response.model';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import moment from 'moment';

@Component({
  selector: 'app-trip-info',
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
  templateUrl: './trip-info.component.html',
  styleUrl: './trip-info.component.scss',
})
export class TripInfoComponent {
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;
  @ViewChild('previewCellBodyTemplate', { static: true })
  previewCellBodyTemplate!: TemplateRef<any>;

  formBuilder = inject(FormBuilder);
  tripInfoService = inject(TripInfoService);

  filterFormGroup!: FormGroup;
  columns: Column[] = [];
  dateRange: Date[] = [];
  currentPage = 0;
  currentRows = 20;
  tableLoading: boolean = false;

  tripInfoData = signal<ITripInfoResponse | null>(null);
  tripInfoTableData = signal<ITripInfoTableData[]>([]);

  ngOnInit() {
    this.builder();
    this.defineColumn();
    this.getTripInfo();
  }
  builder() {
    this.filterFormGroup = this.formBuilder.group({
      acReg: [''],
      flightNo: [''],
      depPort: [''],
      arrPort: [''],
      dateRange: [this.dateRangeDefaultValue()],
    });
  }

  defineColumn() {
    this.columns = [
      { field: 'aircraftReg', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'depPort', header: 'Departure' },
      { field: 'arrPort', header: 'Arrival' },
      { field: 'depDateTime', header: 'Dep Date/Time' },
      { field: 'arrDateTime', header: 'Arr Date/Time' },
      { field: 'username', header: 'Send By' },
      { field: 'pantryCode', header: 'Pantry Code' },
      { field: 'crewVersion', header: 'Crew Version' },
      { field: 'pax', header: 'Pax' },
      { field: 'tripFuel', header: 'Trip Fuel' },
      { field: 'taxiFuel', header: 'Taxi Fuel' },
      { field: 'eet', header: 'EET' },
      { field: 'takeOffTime', header: 'Take Off Time' },
      { field: 'status', header: 'Status' },
      { field: '', header: '', template: this.previewCellBodyTemplate },
    ];
  }

  getTripInfo() {
    this.tableLoading = true;

    const formValues = this.filterFormGroup.value;
    const acReg = formValues.acReg?.trim() || null;
    const flightNo = formValues.flightNo?.trim() || null;
    const depPort = formValues.depPort?.trim() || null;
    const arrPort = formValues.arrPort?.trim() || null;

    let startDate = '';
    let endDate = '';

    // Tarih aralığı kontrolü ve formatlama
    if (formValues.dateRange && formValues.dateRange.length === 2) {
      const [start, end] = formValues.dateRange;

      if (start && end) {
        startDate = moment(start).format('YYYY-MM-DD');
        endDate = moment(end).format('YYYY-MM-DD');
      }
    }

    this.tripInfoService
      .getTripInfo(
        this.currentPage,
        this.currentRows,
        startDate,
        endDate,
        acReg,
        flightNo,
        depPort,
        arrPort,
      )
      .subscribe({
        next: (response) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depDateTime: moment(item.depDateTime).format('DD/MM/YYYY - HH:mm'),
            arrDateTime: moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm'),
          }));

          this.tripInfoData.set(response);
          this.tripInfoTableData.set(formattedData);
          this.tableLoading = false;
        },
        error: () => {
          this.tableLoading = false;
        },
      });
  }

  onFilterSubmit() {
    this.getTripInfo();
  }

  dateRangeDefaultValue() {
    const endDate = moment();
    const startDate = moment().subtract(3, 'days');

    return [startDate.toDate(), endDate.toDate()];
  }

  lazyLoadEvent(event: any) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getTripInfo();
  }
}
