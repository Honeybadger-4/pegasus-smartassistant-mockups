import {
  Component,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { LicenceModalComponent } from './components/licence-modal/licence-modal.component';
import { Column } from '@shared/models/columns';

@Component({
  selector: 'app-licence-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    LicenceModalComponent,
  ],
  templateUrl: './licence-info.component.html',
  styleUrl: './licence-info.component.scss',
})
export class LicenceInfoComponent implements OnInit {
  customTableComponent = viewChild.required(CustomTableComponent);
  licenceColumnTemplate = viewChild.required('licenceColumnTemplate');

  searchInputValue = '';
  columns = signal<Column[]>([]);
  showLicenceModal = signal(false);
  selectedRowData: any = null;

  licenceInfoData = [
    {
      acReg: 'lorem',
      flightNo: 'lorem',
      depDateTime: '01/01/2020 - 10:29',
      checkedDateTime: '01/01/2020 - 10:29',
      checkedBy: 'Name Surname',
      licences: '',
    },
    {
      acReg: 'ipsum',
      flightNo: 'ipsum',
      depDateTime: '02/01/2020 - 11:00',
      checkedDateTime: '02/01/2020 - 11:30',
      checkedBy: 'Another Name',
      licences: '',
    },
    {
      acReg: 'dolor',
      flightNo: 'dolor',
      depDateTime: '03/01/2020 - 12:15',
      checkedDateTime: '03/01/2020 - 12:45',
      checkedBy: 'Some Name',
      licences: '',
    },
  ];

  ngOnInit() {
    this.defineColumn();
  }

  defineColumn() {
    this.columns.set([
      { field: 'acReg', header: 'Ac Reg', isFilter: true },
      { field: 'flightNo', header: 'Flight No', isFilter: true },
      { field: 'depDateTime', header: 'Dep Date - Time', isFilter: true },
      {
        field: 'checkedDateTime',
        header: 'Checked Date - Time',
        isFilter: true,
      },
      { field: 'checkedBy', header: 'Checked By', isFilter: true },
      {
        field: 'licences',
        header: 'Licences',
        isFilter: false,
        template: this.licenceColumnTemplate(),
      },
    ]);
  }

  onChangeSearch(value: string) {}

  onLicenceShow(rowData: any) {
    this.selectedRowData = rowData;
    this.showLicenceModal.set(true);
  }

  get licenceModalVisible() {
    return this.showLicenceModal();
  }

  set licenceModalVisible(value: boolean) {
    this.showLicenceModal.set(value);
  }
}
