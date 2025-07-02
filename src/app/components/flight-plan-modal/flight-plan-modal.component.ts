import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IFlightPlanModalPdfResponse } from '@shared/models/flight-plan-modal-pdf-response.model';

@Component({
  selector: 'app-flight-plan-modal',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './flight-plan-modal.component.html',
   styleUrl: './flight-plan-modal.components.scss',
})
export class FlightPlanModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  pdfSrc: SafeResourceUrl | null = null;
  sanitizer = inject(DomSanitizer);

  // pdfData her değiştiğinde burası tetiklenir
  @Input() set pdfData(data: IFlightPlanModalPdfResponse | null) {
    if (data?.CONTENT) {
      const base64 = `data:${data.TYPE};base64,${data.CONTENT}`;
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    } else {
      this.pdfSrc = null;
    }
  }

  onClose() {
    this.visibleChange.emit(false);
  }
}
