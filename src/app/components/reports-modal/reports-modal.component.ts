import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { IReportsContentData } from '@shared/models/reports-response.model';

@Component({
  selector: 'app-reports-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, TabsModule],
  templateUrl: './reports-modal.component.html',
  styleUrls: ['./reports-modal.component.scss'],
})
export class ReportsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() rowData: IReportsContentData | null = null;

  activeTabIndex = signal<number>(0);

  resetTabIndex(): void {
    this.activeTabIndex.set(0);
  }

  closeModal(): void {
    this.visibleChange.emit(false);
  }
}
