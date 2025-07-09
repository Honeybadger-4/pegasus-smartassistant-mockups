import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { IReportsContentData } from '@shared/models/reports-response.model';

@Component({
  selector: 'app-reports-modal',
  imports: [CommonModule, DialogModule],
  templateUrl: './reports-modal.component.html',
  styleUrl: './reports-modal.component.scss',
})
export class ReportsModalComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() rowData: IReportsContentData | null = null;
  closeModal() {
    this.visibleChange.emit(false);
  }
}
