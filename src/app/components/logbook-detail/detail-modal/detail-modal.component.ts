import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { IDetailedListContentData } from '@shared/models/detailed-list-response.model';

@Component({
    selector: 'app-detail-modal',
    imports: [CommonModule, DialogModule, ButtonModule],
    templateUrl: './detail-modal.component.html',
    styleUrl: './detail-modal.component.scss'
})
export class DetailModalComponent {
  detailedListRowData = input<IDetailedListContentData | null>(null);
  @Input() visible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
