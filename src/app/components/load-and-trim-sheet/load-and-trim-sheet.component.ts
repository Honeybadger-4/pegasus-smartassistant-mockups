import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadAndTrimSheetService } from '@shared/services/load-and-trim-sheet.service';
import { ILoadSheetTableData } from '@shared/models/load-sheet-response.model';
import { ILoadSheetModalsResponse } from '@shared/models/load-and-trim-sheet-response.model';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-load-and-trim-sheet',
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './load-and-trim-sheet.component.html',
  styleUrl: './load-and-trim-sheet.component.scss',
})
export class LoadAndTrimSheetComponent {
  @Input() visible = true;
  @Input() loadSheetRowData: ILoadSheetTableData | null = null;
  @Output() closeModal = new EventEmitter<void>();

  loadAndTrimSheetService = inject(LoadAndTrimSheetService);
  loadAndTrimSheetData = signal<ILoadSheetModalsResponse | null>(null);

  dialogOpened() {
    if (this.loadSheetRowData) {
      this.getLoadAndTrimSheet(this.loadSheetRowData.legIsn);
    }
  }

  getLoadAndTrimSheet(legIsn: number) {
    this.loadAndTrimSheetService.getLoadAndTrimSheet(legIsn).subscribe({
      next: (response: ILoadSheetModalsResponse) => {
        this.loadAndTrimSheetData.set(response);
        console.log(this.loadAndTrimSheetData);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  close() {
    this.closeModal.emit();
  }
}
