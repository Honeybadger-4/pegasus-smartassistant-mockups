import { CommonModule } from '@angular/common';
import { Component, Input, input, output } from '@angular/core';

import { CgLimitsChartComponent } from '../cg-limits-chart/cg-limits-chart.component';

import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-cg-limits-dialog',
  imports: [CommonModule, DialogModule, CgLimitsChartComponent],
  templateUrl: './cg-limits-dialog.component.html',
  styleUrl: './cg-limits-dialog.component.scss',
})
export class CgLimitsDialogComponent {
  @Input() visible = false;
  selectedRowData = input<any | null>(null);
  visibleChange = output<boolean>();

  close() {
    this.visibleChange.emit(false);
  }
}
