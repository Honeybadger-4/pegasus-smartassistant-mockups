import { Component } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-route-table-header',
  imports: [
    CommonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    DatePicker,
  ],
  templateUrl: './route-table-header.component.html',
  styleUrl: './route-table-header.component.scss',
})
export class RouteTableHeaderComponent {
  dateRange: Date[] = [];
}
