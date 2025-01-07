import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { LoadAndTrimSheetService } from '@shared/services/load-and-trim-sheet.service';
import { ILoadSheetTableData } from '@shared/models/load-sheet-response.model';
import { ILoadandTrimSheetResponse } from '@shared/models/load-and-trim-sheet-response.model';

@Component({
  selector: 'app-load-and-trim-sheet',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './load-and-trim-sheet.component.html',
  styleUrl: './load-and-trim-sheet.component.scss',
})
export class LoadAndTrimSheetComponent {
  @Input() visible: boolean = true;
  @Input() loadSheetRowData: ILoadSheetTableData | null = null;
  @Output() closeModal = new EventEmitter<void>();

  loadAndTrimSheetService = inject(LoadAndTrimSheetService);
  loadAndTrimSheetData!: ILoadandTrimSheetResponse;

  dialogOpened() {
    if (this.loadSheetRowData) {
      this.getLoadAndTrimSheet(this.loadSheetRowData.legIsn);
    }
  }

  getLoadAndTrimSheet(legIsn: number) {
    this.loadAndTrimSheetService.getLoadAndTrimSheet(legIsn).subscribe({
      next: (response: ILoadandTrimSheetResponse) => {
        this.loadAndTrimSheetData = response;
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
