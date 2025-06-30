import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
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
export class FlightPlanModalComponent implements OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() pdfData: IFlightPlanModalPdfResponse | null = null;

  pdfSrc: SafeResourceUrl | null = null;
  private sanitizer = inject(DomSanitizer);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pdfData'] && this.pdfData?.CONTENT) {
      const base64 = `data:${this.pdfData.TYPE};base64,${this.pdfData.CONTENT}`;
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    }
  }

  onClose() {
    this.visibleChange.emit(false);
  }
}
