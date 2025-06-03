import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';

import { Column } from '@shared/models/columns';
import { FormsModule } from '@angular/forms';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { CrewInformationService } from '@shared/services/crew-information.service';
import { ICrewInformationContentData, ICrewInformationResponse } from '@shared/models/crew-information-response.model';
import moment from 'moment';



@Component({
  selector: 'app-crew-information',
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './crew-information.component.html',
  styleUrls: ['./crew-information.component.scss'],
})
export class CrewInformationComponent implements OnInit {
  customTableComponent = viewChild.required(CustomTableComponent);
  searchInput = viewChild.required<ElementRef>('searchInput');

    crewInformationService = inject(CrewInformationService);
  

  searchInputValue = signal<string>('');





  columns = signal<Column[]>([]);
    selectedRow = signal<ICrewInformationContentData | null>(null);

  

  crewInformationData = signal<ICrewInformationResponse | null>(null);
  crewInformationContentData = signal<ICrewInformationResponse['content'] | null>(
    null,
  );

  currentPage = signal<number>(0);
  currentRows = signal<number>(10);
  tableFilters = signal<any>({});

  tableLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.defineColumns();
    this.setupSearchListener();
  }

  defineColumns() {
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
      { field: 'nameSurname', header: 'Name Surname', isFilter: true },
      { field: 'companyId', header: 'Company ID', isFilter: true },
      { field: 'leg', header: 'Leg', isFilter: true },

      { field: 'duty', header: 'Duty', isFilter: true },
      {
        field: 'dutyStart',
        header: 'Duty Smart (GMT)',
        isFilter: true,
        filterType: 'timeonly',
      },

      {
        field: 'additionalDutyTime',
        header: 'Additional Duty Time',
        isFilter: true,
        filterType: 'timeonly',
      },

      {
        field: 'pass',
        header: ' Pass',
        isFilter: true,
      },
      {
        field: 'pF',
        header: 'PF',
        isFilter: true,
      },
      {
        field: 'pM',
        header: 'PM',
        isFilter: true,
      },
      {
        field: 'DecisionOfPilotInCommand',
        header: 'Decision of Pilot in Command',
        isFilter: true,
      },
    ]);
  }

  getAllCrewInformation() { this.tableLoading.set(true);
  
      this.crewInformationService
        .getAllCrewInformation(
          this.currentPage(),
          this.currentRows(),
          this.searchInputValue(),
          this.tableFilters(),
        )
        .subscribe({
          next: (response: ICrewInformationResponse) => {
            const formattedData = response.content.map((item) => ({
              ...item,
              depDateTime: item.depDateTime
                ? moment(item.depDateTime).format('DD/MM/YYYY - HH:mm')
                : null,
  
              arrDateTime: item.arrDateTime
                ? moment(item.arrDateTime).format('DD/MM/YYYY - HH:mm')
                : null,
            }));
  
            this.crewInformationContentData.set(formattedData);
            this.crewInformationData.set(response);
  
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

          this.getAllCrewInformation();
        }
      });
  }
 
  onChangeSearch(value: string) {
    this.searchInputValue.set(value.toUpperCase());
    this.currentPage.set(0);
    this.customTableComponent().resetTableFirstValue();
    this.getAllCrewInformation();
  }
lazyLoadEvent(event: any) {
    const page = event.first / event.rows;
    this.currentPage.set(page);
    this.currentRows.set(event.rows);

    this.tableFilters.set({
      acReg: event.filters?.acReg && event.filters?.acReg[0].value,
      flightNo: event.filters?.flightNo && event.filters?.flightNo[0].value,
      depPort: event.filters?.depPort && event.filters?.depPort[0].value,
      depDate:
        event.filters?.depDateTime && event.filters?.depDateTime[0].value,

      arrPort: event.filters?.arrPort && event.filters?.arrPort[0].value,

      arrDate:
        event.filters?.arrDateTime && event.filters?.arrDateTime[0].value,

      firstPointName:
        event.filters?.firstPointName && event.filters?.firstPointName[0].value,

      lastPointName:
        event.filters?.lastPointName && event.filters?.lastPointName[0].value,

      time: event.filters?.time && event.filters?.time[0].value,

      flightPhase:
        event.filters?.flightPhase && event.filters?.flightPhase[0].value,
      flightLevel:
        event.filters?.flightLevel && event.filters?.flightLevel[0].value,
      duration: event.filters?.duration && event.filters?.duration[0].value,
    });
    console.log(this.tableFilters());

    this.getAllCrewInformation();
  }}
