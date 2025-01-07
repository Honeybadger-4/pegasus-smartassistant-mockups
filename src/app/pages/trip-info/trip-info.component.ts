import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { DropdownModule } from 'primeng/dropdown';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { CalendarModule } from 'primeng/calendar';
import { TripInfoService } from '@shared/services/trip-info.service';
import {
  ITripInfoResponse,
  ITripInfoTableData,
} from '@shared/models/trip-info-response.model';
import moment from 'moment';

@Component({
  selector: 'app-trip-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    CustomTableComponent,
    CalendarModule,
  ],
  templateUrl: './trip-info.component.html',
  styleUrl: './trip-info.component.scss',
})
export class TripInfoComponent {
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;
  @ViewChild('previewCellBodyTemplate', { static: true })
  previewCellBodyTemplate!: TemplateRef<any>;
  @ViewChild('downloadCellBodyTemplate', { static: true })
  downloadCellBodyTemplate!: TemplateRef<any>;

  tripInfoService = inject(TripInfoService);
  columns: Column[] = [];
  dateRange: Date[] = [];
  currentPage = 0;
  currentRows = 20;

  tripInfoData = signal<ITripInfoResponse | null>(null);
  tripInfoTableData = signal<ITripInfoTableData[]>([]);

  ngOnInit() {
    this.defineColumn();

    const today = moment();
    this.initialDateRangeValue();
    this.getTripInfo();
  }

  defineColumn() {
    this.columns = [
      { field: 'aircraftReg', header: 'Aircraft' },
      { field: 'flightNo', header: 'Flight No' },
      { field: 'depPort', header: 'Departure' },
      { field: 'arrPort', header: 'Arrival' },
      { field: 'depDateTime', header: 'Dep Date/Time' },
      { field: 'arrDateTime', header: 'Arr Date/Time' },
      { field: 'username', header: 'Username' },
      { field: '', header: '', template: this.previewCellBodyTemplate },
      { field: '', header: '', template: this.downloadCellBodyTemplate },
    ];
  }

  initialDateRangeValue() {
    const today = moment();
    this.dateRange = [
      today.clone().subtract(7, 'days').toDate(),
      today.clone().add(7, 'days').toDate(),
    ];
  }

  getTripInfo() {
    let startDate = '';
    let endDate = '';

    // Tarih aralığı kontrolü ve formatlama
    if (this.dateRange.length === 2) {
      const [start, end] = this.dateRange;

      if (start && end) {
        startDate = moment(start).format('YYYY-MM-DD');
        endDate = moment(end).format('YYYY-MM-DD');
      }
    }

    this.tripInfoService
    .getTripInfo(startDate, endDate, this.currentPage,this.currentRows,)
    .subscribe({
      next: (response) => {
        this.tripInfoData.set(response);
        this.tripInfoTableData.set(response.content);
      },
      error: (error) => {
        console.error(error);
      },
    });
}

  pageEvent(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getTripInfo();
  }

  onDateRangeChange(event: Event) {
    const [startDate, endDate] = this.dateRange;

    if (startDate && endDate) {
      this.currentPage = 0;
      this.customTableComponent.resetTableFirstValue();
      this.getTripInfo();
    }
  }
}
