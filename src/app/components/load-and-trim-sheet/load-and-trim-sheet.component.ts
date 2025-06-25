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
import { ILoadSheetContentData } from '@shared/models/load-sheet-response.model';

@Component({
  selector: 'app-load-and-trim-sheet',
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './load-and-trim-sheet.component.html',
  styleUrls: ['./load-and-trim-sheet.component.scss'],
})
export class LoadAndTrimSheetComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() loadSheetRowData: ILoadSheetContentData | null = null;

  raw = signal<any | null>(null);

  loadAndTrimSheet = inject(LoadSheetService);

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

  close() {
    this.visibleChange.emit(false);
  }
}
