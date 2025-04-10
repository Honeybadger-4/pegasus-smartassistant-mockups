import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  output,
  Output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-custom-table',
  imports: [CommonModule, FormsModule, TableModule, SelectModule],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
})
export class CustomTableComponent {
  table = viewChild.required<Table>('table');

  tableData = input<any>();
  tableColumns = input<Column[]>();
  tableLoading = input<boolean>(false);
  selectionMode = input<'single' | 'multiple' | null>();
  isPaginator = input<boolean>(true);
  totalRecords = input<number>(0);
  noDataFoundMsg = input<string>('No data found.');
  footerTemplate = input<TemplateRef<any> | null>(null);

  lazyLoadEvent = output<any>();
  @Output() selectedCheckbox: EventEmitter<any> = new EventEmitter<any>();
  selectionData: any[] = [];

  rows = 20;

  selectionChange(event: any) {
    this.selectedCheckbox.emit(event);
  }

  onLazyLoad(event: any) {
    console.log(event);
    this.lazyLoadEvent.emit(event);
  }

  // It resets the table's first value to 0 when needed, triggered from the parent component.
  resetTableFirstValue() {
    if (this.table().first) {
      this.table().first = 0;
    }
  }

  clearSelectionData() {
    this.selectionData = [];
  }
}
