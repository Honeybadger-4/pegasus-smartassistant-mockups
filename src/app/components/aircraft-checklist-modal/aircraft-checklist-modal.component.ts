import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { IAircraftChecklistSignatureResponse } from '@shared/models/aircraft-checklist-signature-response.model';
@Component({
  selector: 'app-aircraft-checklist-modal',
  imports: [CommonModule, DialogModule],
  templateUrl: './aircraft-checklist-modal.component.html',
  styleUrl: './aircraft-checklist-modal.component.scss'
})
export class AircraftChecklistModalComponent {

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() rowData: IAircraftChecklistSignatureResponse | null = null;

 
getSignatureImage(): string | null {
  const signature = this.rowData?.signature;
  return signature ? `data:image/png;base64,${signature}` : null;
}


  closeModal() {
    this.visibleChange.emit(false);
  }
}
