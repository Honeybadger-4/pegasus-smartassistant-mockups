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

@Component({
  selector: 'app-load-and-trim-sheet',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './load-and-trim-sheet.component.html',
  styleUrls: ['./load-and-trim-sheet.component.scss'],
})
export class LoadAndTrimSheetComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() loadSheetRowData: { id?: number } | null = null;

  raw = signal<ILoadSheetModalsResponse | null>(null);

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
