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

@Component({
  selector: 'app-lmc-details-modal',
  standalone: true,
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
    return this.rowData?.lmc?.lmcJson ?? [];
  }

  get totalWeight(): number {
    return this.lmcModalData
      .map(r => r.weight ?? 0)
      .reduce((sum, w) => sum + w, 0);
  }

  closeModal() {
    this.visibleChange.emit(false);
  }
}
