import { Component } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';


@Component({
    selector: 'app-table-header',
    imports: [
        CommonModule,
        DropdownModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        FormsModule,
        DatePicker,
    ],
    templateUrl: './table-header.component.html',
    styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent {
  dateRanges: Date[] = [];
}
