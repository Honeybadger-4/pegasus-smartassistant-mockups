import { Component, OnInit, signal, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Chip } from 'primeng/chip';
import { FlightPlansService } from '@shared/services/flight-plans.service';
import { IFlightPlan } from '@shared/models/flight-plans-response.model';
import moment from 'moment';

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
  ],
  templateUrl: './flight-plans.component.html',
  styleUrl: './flight-plans.component.scss',
})
export class FlightPlansComponent implements OnInit {
  customTableComponent = viewChild.required(CustomTableComponent);
  flightPlansColumnTemplate = viewChild.required('flightPlansColumnTemplate');
  statusColumnTemplate = viewChild.required('statusColumnTemplate');

  flightPlansService = inject(FlightPlansService);

  columns = signal<Column[]>([]);
  flightPlansData = signal<IFlightPlan[] | null>(null);
  flightPlansTotal = signal<number>(0);

  searchInputValue = signal<string>('');
  currentPage = signal<number>(0);
  currentRows = signal<number>(10);
  tableFilters = signal<any>({});

  ngOnInit() {
    this.defineColumn();
    this.getFlightPlans();
  }

  defineColumn() {
    this.columns.set([
      { field: 'acReg', header: 'Ac Reg', isFilter: true },
      { field: 'flightNo', header: 'Flight No', isFilter: true },
      {
        field: 'depDateTime',
        header: 'Dep Date - Time',
          isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'receivedDateTime',
        header: 'Received Date - Time',
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
      },
      {
        field: 'approvedDateTime',
        header: 'Approved Date - Time',
          isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'replacedDateTime',
        header: 'Replaced Date - Time',
          isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'declinedDateTime',
        header: 'Declined Date - Time',
   isFilter: true,
        filterType: 'datepicker',
      },
      {
        field: 'submittedDateTime',
        header: 'Submitted Date - Time',
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
    this.flightPlansService
      .getFlightPlans(
        this.currentPage(),
        this.currentRows(),
        this.searchInputValue(),
        this.tableFilters()
      )
      .subscribe((res) => {
        const formatted = res.content.map((item) => ({
          ...item,
          depDateTime: moment(item.depDateTime).format('DD/MM/YYYY - HH:mm'),
          receivedDateTime: moment(item.receivedDateTime).format('DD/MM/YYYY - HH:mm'),
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

        this.flightPlansData.set(formatted);
        this.flightPlansTotal.set(res.totalElements);
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
      acReg: event.filters?.acReg?.[0]?.value,
      flightNo: event.filters?.flightNo?.[0]?.value,
      depDateTime: event.filters?.depDateTime?.[0]?.value,
      receivedDateTime: event.filters?.receivedDateTime?.[0]?.value,
      version: event.filters?.version?.[0]?.value,
      responsibleUser: event.filters?.responsibleUser?.[0]?.value,
      status: event.filters?.status?.[0]?.value,
      approvedDateTime: event.filters?.approvedDateTime?.[0]?.value,
      replacedDateTime: event.filters?.replacedDateTime?.[0]?.value,
      declinedDateTime: event.filters?.declinedDateTime?.[0]?.value,
      submittedDateTime: event.filters?.submittedDateTime?.[0]?.value,
    });

    this.getFlightPlans();
  }

  onFlightPlansShow(rowData: IFlightPlan) {
    console.log('Selected row:', rowData);
  }
}
