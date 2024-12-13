import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
}
