import {
  Component,
  ElementRef,
  EventEmitter,
  input,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { IDetailedListContentData } from '@shared/models/detailed-list-response.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-detail-modal',
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './detail-modal.component.html',
  styleUrl: './detail-modal.component.scss',
})
export class DetailModalComponent {
  detailedListRowData = input<IDetailedListContentData | null>(null);
  @Input() visible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('tableToPdf', { static: false }) tableToPdf!: ElementRef;

  close() {
    this.closeModal.emit();
  }
  async generatePDF() {
    const element = this.tableToPdf.nativeElement;

    // HTML içeriği canvas olarak alınıyor
    const canvas = await html2canvas(element, {
      scale: 2, // Daha yüksek çözünürlük için
      useCORS: true, // Dış kaynaklı stilleri yükler
    });
    const imageData = canvas.toDataURL('image/png');

    // PDF oluştur ve görseli ekle
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Kenar boşluklarını ayarla
    const margin = 10;
    const availableWidth = pdfWidth - margin * 2;
    const availableHeight = pdfHeight - margin * 2;

    // Görselin oranını koruyarak ölçekleme
    const ratio = Math.min(
      availableWidth / canvasWidth,
      availableHeight / canvasHeight,
    );
    const scaledWidth = canvasWidth * ratio;
    const scaledHeight = canvasHeight * ratio;

    // Görseli ortalayarak yerleştir
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;

    pdf.addImage(imageData, 'PNG', x, y, scaledWidth, scaledHeight);
    pdf.save('logbook-detail.pdf');
  }
}
