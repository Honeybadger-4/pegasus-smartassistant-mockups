import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // CommonModule'u ekleyin

@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [CommonModule], // CommonModule burada ekleniyor
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.scss'],
})
export class DetailModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  data = [
    {
      date: '22.07.2025',
      type: 'B737',
      reg: 'TC-IZE',
      depPlace: 'SAW',
      depTime: '05:05',
      arrPlace: 'ADB',
      arrTime: '06:14',
      singlePilot: 'X',
      multiPilot: '01:09',
      totalTime: '01:09',
    },
  ];

  close() {
    this.closeModal.emit();
  }
}