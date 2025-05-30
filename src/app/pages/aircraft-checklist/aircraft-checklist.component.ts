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
  selector: 'app-aircraft-checklist',
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './aircraft-checklist.component.html',
  styleUrl: './aircraft-checklist.component.scss',
})
export class AircraftChecklistComponent implements OnInit {
  customTableComponent = viewChild.required(CustomTableComponent);
  searchInput = viewChild.required<ElementRef>('searchInput');

  searchInputValue = signal<string>('');

  columns = signal<Column[]>([]);

  aircraftChecklistData = 0;
  aircraftChecklisTableData: any[] = [];

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

      { field: 'melItems', header: 'MEL Items', isFilter: false },
      { field: 'dailyCheck', header: 'Daily Check', isFilter: false },

      { field: 'defferedItems', header: 'Deffered Items', isFilter: false },
      { field: 'preflightCheck', header: 'Preflight Check', isFilter: false },
      { field: 'fluidUplift', header: 'Fluid Uplift', isFilter: false },

      { field: 'securitySearch', header: 'Security Search', isFilter: false },
      { field: 'signature', header: 'Signature', isFilter: false },
      { field: 'confirmed By', header: 'Confirmed by', isFilter: true },
      {
        field: 'confirmedDateTime',
        header: 'Confirmed Date',
        isFilter: true,
        filterType: 'datepicker',
      },
    ]);
  }

  getAircraftChecklist() {}

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

          this.getAircraftChecklist();
        }
      });
  }
  onChangeSearch(value: string) {
    this.searchInputValue.set(value.toUpperCase());
  }
  lazyLoadEvent(event: any) {}
}
