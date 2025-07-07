import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { LoadSheetService } from '@shared/services/load-sheet.service';
import { ILoadSheetModalsResponse } from '@shared/models/load-sheet-modals-response';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-load-and-trim-sheet',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ToastModule],
  templateUrl: './load-and-trim-sheet.component.html',
  styleUrls: ['./load-and-trim-sheet.component.scss'],
})
export class LoadAndTrimSheetComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() loadSheetRowData: { id?: number } | null = null;

  raw = signal<ILoadSheetModalsResponse | null>(null);

  loadAndTrimSheet = inject(LoadSheetService);
  messageService = inject(MessageService);

  dialogOpened() {
    const id = this.loadSheetRowData?.id;
    if (!id) {
      this.raw.set(null);
      return;
    }
    this.loadAndTrimSheet.getLoadSheetModalInfo(id).subscribe({
      next: (data) => this.raw.set(data),
      error: () => this.raw.set(null),
    });
  }
  downloadAsPDF() {
    this.messageService.add({
      severity: 'info',
      summary: 'Generating PDF',
      life: 5000,
    });

    const element = document.querySelector(
      '#LoadAndTrimSheet .content-container',
    ) as HTMLElement;
    if (!element) {
      console.error('Element bulunamadı!');
      return;
    }

    html2canvas(element, {
      scale: 1,
      useCORS: true,
      logging: false,
      allowTaint: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const marginX = 10;
      const imgWidth = pdfWidth - marginX * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;

      let remainingHeight = imgHeight;

      while (remainingHeight > 0) {
        pdf.addImage(imgData, 'PNG', marginX, position, imgWidth, imgHeight);
        remainingHeight -= pdfHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
          position = position - pdfHeight;
        }
      }

      pdf.save('load-and-trim-sheet.pdf');
    });
  }

  getLmcTotalWeight(): number {
    const lmcList = this.raw()?.lmc?.lmcJson;
    if (!lmcList) {
      return 0;
    }
    return lmcList.reduce((sum, item) => sum + (item.weight || 0), 0);
  }

  getAdjZeroFuelWeight(): number | null {
    const actual = this.raw()?.zeroFuelWeightActual;
    const lmcTotal = this.getLmcTotalWeight();
    if (actual == null) return null;
    return actual + lmcTotal;
  }

  getAdjTakeOffWeight(): number | null {
    const actual = this.raw()?.takeOffWeightActual;
    const lmcTotal = this.getLmcTotalWeight();
    if (actual == null) return null;
    return actual + lmcTotal;
  }

  getAdjLandingWeight(): number | null {
    const actual = this.raw()?.landingWeightActual;
    const lmcTotal = this.getLmcTotalWeight();
    if (actual == null) return null;
    return actual + lmcTotal;
  }

  close() {
    this.visibleChange.emit(false);
  }
}
