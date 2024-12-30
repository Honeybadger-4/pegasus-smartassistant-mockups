import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  output,
  Output,
  ViewChild,
} from '@angular/core';
import { Column } from '@shared/models/columns';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
})
export class CustomTableComponent {
  @ViewChild('table') table!: Table;

  tableData = input<any>();
  tableColumns = input<Column[]>();
  selectionMode = input<'single' | 'multiple' | null>();
  isPaginator = input<boolean>(true);
  totalRecords = input<number>(0);

  pageEvent = output<any>();
  @Output() rowClickedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedCheckbox: EventEmitter<any> = new EventEmitter<any>();
  selectionData: any[] = [];

  rows = 20;

  rowClicked(rowData: any) {
    this.rowClickedEvent.emit(rowData);
  }

  selectionChange(event: any) {
    this.selectedCheckbox.emit(event);
  }

  pageChange(event: any) {
    this.pageEvent.emit(event);
  }

  // It resets the table's first value to 0 when needed, triggered from the parent component.
  resetTableFirstValue() {
    if (this.table.first) {
      this.table.first = 0;
    }
  }
}
