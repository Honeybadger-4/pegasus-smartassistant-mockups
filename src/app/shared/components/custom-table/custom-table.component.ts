import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  Input,
  output,
  Output,
} from '@angular/core';
import { Column } from '@shared/models/columns';
import { TableModule } from 'primeng/table';
import { first } from 'rxjs';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
})
export class CustomTableComponent {
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
  first = 0;

  rowClicked(rowData: any) {
    this.rowClickedEvent.emit(rowData);
  }

  selectionChange(event: any) {
    this.selectedCheckbox.emit(event);
  }

  pageChange(event: any) {
    this.pageEvent.emit(event);
  }
}
