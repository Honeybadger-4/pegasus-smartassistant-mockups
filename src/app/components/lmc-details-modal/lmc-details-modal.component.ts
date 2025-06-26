import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { ILoadSheetModalsResponse } from '@shared/models/load-sheet-modals-response';
import moment from 'moment';

@Component({
  selector: 'app-lmc-details-modal',
  imports: [CommonModule, DialogModule, CustomTableComponent],
  templateUrl: './lmc-details-modal.component.html',
  styleUrls: ['./lmc-details-modal.component.scss']
})
export class LmcDetailsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() rowData: ILoadSheetModalsResponse | null = null;

  lmcModalColumns = [
    { field: 'destination', header: 'Dest' },
    { field: 'spcType',     header: 'Spec. Type' },
    { field: 'spcAmount',   header: 'Spec. Amount' },
    { field: 'clCpt',       header: 'CL/CPT' },
    { field: 'weight',      header: 'Weight' },
    { field: 'enteredDate', header: 'Entered Date/Time' },
    { field: 'enteredBy',   header: 'Entered By' },
  ];

  get lmcModalData(): any[] {
    const list = this.rowData?.lmc?.lmcJson;
    if (!Array.isArray(list) || list.length === 0) {
      return [];
    }
    return list.map(j => ({
      destination:  j.destination,
      spcType:      j.spcType,
      spcAmount:    j.spcAmount,
      clCpt:        j.clCpt,
      weight:       j.weight,
      enteredDate:  j.enteredDate
        ? moment(j.enteredDate).format('DD/MM/YYYY - HH:mm')
        : '-',
      enteredBy:    j.enteredBy ?? '-',
    }));
  }

  closeModal() {
    this.visibleChange.emit(false);
  }
}
