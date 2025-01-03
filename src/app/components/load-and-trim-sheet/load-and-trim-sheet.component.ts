import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-load-and-trim-sheet',
  standalone: true,
  imports: [CommonModule, DialogModule,],
  templateUrl: './load-and-trim-sheet.component.html',
  styleUrl: './load-and-trim-sheet.component.scss'
})
export class LoadAndTrimSheetComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Input() visible: boolean = true;
  
    close() {
      this.closeModal.emit();
    }
}
