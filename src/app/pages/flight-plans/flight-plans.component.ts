import {
  Component,
  OnInit,
  inject,
  viewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Chip } from 'primeng/chip';
import { FlightPlansService } from '@shared/services/flight-plans.service';
import { FlightPlanPdfService } from '@shared/services/flightPlan/flight-plan-pdf.service';
import { IFlightPlan } from '@shared/models/flight-plans-response.model';
import { IFlightPlanModalPdfResponse } from '@shared/models/flight-plan-modal-pdf-response.model';
import moment from 'moment';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


import { FlightPlanModalComponent } from '../../components/flight-plan-modal/flight-plan-modal.component';



@Component({
  selector: 'app-flight-plans',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    Chip,
    FlightPlanModalComponent
  ],
  templateUrl: './flight-plans.component.html',
  styleUrl: './flight-plans.component.scss',
})
export class FlightPlansComponent implements OnInit {
  customTableComponent = viewChild.required(CustomTableComponent);
  flightPlansColumnTemplate = viewChild.required('flightPlansColumnTemplate');
  statusColumnTemplate = viewChild.required('statusColumnTemplate');
  searchInput = viewChild.required<ElementRef>('searchInput');

  flightPlansService = inject(FlightPlansService);
  flightPlanPdfService = inject(FlightPlanPdfService);

  columns = signal<Column[]>([]);
  flightPlansData = signal<IFlightPlan[] | null>(null);
  flightPlansTotal = signal<number>(0);

  searchInputValue = signal<string>('');
  currentPage = signal<number>(0);
  currentRows = signal<number>(10);
  tableFilters = signal<any>({});
  tableLoading = signal<boolean>(false);


  displayModal = signal<boolean>(false);
  pdfData = signal<IFlightPlanModalPdfResponse | null>(null);

  ngOnInit() {
    this.defineColumn();
    this.setupSearchListener();
  }

  defineColumn() {
    this.columns.set([
      { field: 'acReg', header: 'Ac Reg', isFilter: true },
      { field: 'flightNo', header: 'Flight No', isFilter: true },
      { field: 'depPort', header: 'Departure Port', isFilter: true },
      {
        field: 'depDateTime',
        header: 'Departure Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      { field: 'arrPort', header: 'Arrival Port', isFilter: true },
      {
        field: 'arrDateTime',
        header: 'Arrival Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'receivedDateTime',
        header: 'Received Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      { field: 'version', header: 'Version', isFilter: true },
      { field: 'responsibleUser', header: 'Responsible User', isFilter: true },
      {
        field: 'status',
        header: 'Status',
        isFilter: true,
        template: this.statusColumnTemplate(),
        filterType: 'selectbox',
        filterOptions: [
          { label: 'Waiting for Approve', value: 'NEW' },
          { label: 'Approved', value: 'APPROVED' },
          { label: 'Submitted', value: 'SUBMITTED' },
          { label: 'Declined', value: 'DECLINED' },
          { label: 'Replaced', value: 'REPLACED' },
        ],
      },
      {
        field: 'approvedDateTime',
        header: 'Approved Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'replacedDateTime',
        header: 'Replaced Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'declinedDateTime',
        header: 'Declined Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'submittedDateTime',
        header: 'Submitted Date',
        isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'flightPlan',
        header: 'Flight Plan',
        isFilter: false,
        template: this.flightPlansColumnTemplate(),
      },
    ]);
  }

  getFlightPlans() {
    this.tableLoading.set(true);

    this.flightPlansService
      .getFlightPlans(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        this.tableFilters(),
      )
      .subscribe({
        next: (response) => {
          const formattedData = response.content.map((item) => ({
            ...item,
            depDateTime: item.depDateTime
              ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            arrDateTime: item.arrDateTime
              ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
              : null,

            receivedDateTime: item.receivedDateTime
              ? moment(item.receivedDateTime).format('DD/MM/YYYY - HH:mm')
              : null,

            approvedDateTime: item.approvedDateTime
              ? moment(item.approvedDateTime).format('DD/MM/YYYY - HH:mm')
              : null,

            replacedDateTime: item.replacedDateTime
              ? moment(item.replacedDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            declinedDateTime: item.declinedDateTime
              ? moment(item.declinedDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
            submittedDateTime: item.submittedDateTime
              ? moment(item.submittedDateTime).format('DD/MM/YYYY - HH:mm')
              : null,
          }));

          this.flightPlansData.set(formattedData);
          this.flightPlansTotal.set(response.totalElements);
          this.tableLoading.set(false);
        },
        error: () => {
          this.tableLoading.set(false);
        },
      });
  }

  setupSearchListener() {
    fromEvent<Event>(this.searchInput().nativeElement, 'input')
      .pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((searchText) => {
        if (searchText.trim() || searchText === '') {
          this.currentPage.set(0);
          this.customTableComponent().resetTableFirstValue();

          this.getFlightPlans();
        }
      });
  }

  onChangeSearch(value: string) {
    this.searchInputValue.set(value.toUpperCase());
    this.currentPage.set(0);
    this.customTableComponent().resetTableFirstValue();
    this.getFlightPlans();
  }

  lazyLoadEvent(event: any) {
    const page = event.first / event.rows;
    this.currentPage.set(page);
    this.currentRows.set(event.rows);

    this.tableFilters.set({
      acReg: event.filters?.acReg && event.filters?.acReg[0].value,
      flightNo: event.filters?.flightNo && event.filters?.flightNo[0].value,

      depDate:
        event.filters?.depDateTime && event.filters?.depDateTime[0].value,

      receivedDate:
        event.filters?.receivedDateTime &&
        event.filters?.receivedDateTime[0].value,
      version: event.filters?.version && event.filters?.version[0].value,
      responsibleUser:
        event.filters?.responsibleUser &&
        event.filters?.responsibleUser[0].value,

      status: event.filters?.status && event.filters?.status[0].value,
      approvedDate:
        event.filters?.approvedDateTime &&
        event.filters?.approvedDateTime[0].value,
      replacedDate:
        event.filters?.replacedDateTime &&
        event.filters?.replacedDateTime[0].value,
      declinedDate:
        event.filters?.declinedDateTime &&
        event.filters?.declinedDateTime[0].value,
      submittedDate:
        event.filters?.submittedDateTime &&
        event.filters?.submittedDateTime[0].value,

      depPort: event.filters?.depPort && event.filters?.depPort[0].value,
      arrPort: event.filters?.arrPort && event.filters?.arrPort[0].value,
      arrDate:
        event.filters?.arrDateTime && event.filters?.arrDateTime[0].value,
    });
    console.log(this.tableFilters());

    this.getFlightPlans();
  }

  onFlightPlansShow(row: IFlightPlan) {
    this.flightPlanPdfService.getPaperFPlan(row.id.toString()).subscribe({
      next: (pdf) => {
        this.pdfData.set(pdf);
        this.displayModal.set(true);
      },
      error: () => {
        // hata yönetimi
      },
    });
  }

  onModalHide() {
    this.displayModal.set(false);
  }
}
