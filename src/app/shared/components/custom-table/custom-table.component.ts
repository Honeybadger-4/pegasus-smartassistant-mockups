import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column } from '@shared/models/columns';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
})
export class CustomTableComponent {
  @Input() tableData: any;
  @Input() tableColumns!: Column[];
  @Input() selectionMode: 'single' | 'multiple' | null = null;

  @Output() rowClickedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedCheckbox: EventEmitter<any> = new EventEmitter<any>();
  selectionData: any[] = [];

  rowClicked(rowData: any) {
    this.rowClickedEvent.emit(rowData);
  }

  selectionChange(event: any) {
    this.selectedCheckbox.emit(event);
  }
}
