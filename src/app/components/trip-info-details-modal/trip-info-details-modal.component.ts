import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ITripInfoDetailsResponse } from '@shared/models/trip-info-details-response.model';

@Component({
  selector: 'app-trip-info-details-modal',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './trip-info-details-modal.component.html',
})
export class TripInfoDetailsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() details: ITripInfoDetailsResponse | null = null;

  closeModal() {
    this.visibleChange.emit(false);
  }
}
