import {
  Component,
  ElementRef,
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

  searchInputValue = signal<string>('');

  columns = signal<Column[]>([]);

  crewInfoData = 0;
  crewInfoTableData: any[] = [];

  currentPage = signal<number>(0);
  currentRows = signal<number>(10);

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

  getCrewInfo() {}

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

          this.getCrewInfo();
        }
      });
  }
  onChangeSearch(value: string) {
    this.searchInputValue.set(value.toUpperCase());
  }
  lazyLoadEvent(event: any) {}
}
