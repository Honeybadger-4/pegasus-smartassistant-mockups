import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { IGpsLossFormContentData } from '@shared/models/gps-loss-forms-response.model';

@Component({
  selector: 'app-gps-loss-forms-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, CustomTableComponent],
  templateUrl: './gps-loss-forms-modal.component.html',
  styleUrls: ['./gps-loss-forms-modal.component.scss'],
})
export class GpsLossFormsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() rowData: IGpsLossFormContentData | null = null;

  gpsLossTypesModalColumns = [{ field: 'impact', header: 'GPS Loss Type' }];

  get tableData() {
    if (!this.rowData) return [];
    return this.rowData.impacts.map((impactValue) => ({ impact: impactValue }));
  }

  closeModal() {
    this.visibleChange.emit(false);
  }
}
