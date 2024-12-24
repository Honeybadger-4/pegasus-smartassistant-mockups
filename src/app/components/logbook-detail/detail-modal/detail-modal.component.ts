import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [],
  templateUrl: './detail-modal.component.html',
  styleUrl: './detail-modal.component.scss'
})
export class DetailModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}