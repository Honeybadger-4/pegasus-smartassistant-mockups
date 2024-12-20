import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';

@Component({
  selector: 'app-airbus-info',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent],
  templateUrl: './airbus-info.component.html',
  styleUrl: './airbus-info.component.scss',
})
export class AirbusInfoComponent {
  columns: Column[] = [];
  airbusInfoData = [
    {
      month: 'January',
      flight: '120  / 2.456 hours',
      training: '20  / 856 hours',
    },
    {
      month: 'February',
      flight: '135  / 2.987 hours',
      training: '10  / 456 hours',
    },
    {
      month: 'March',
      flight: '120  / 2.456 hours',
      training: '20  / 856 hours',
    },
    {
      month: 'April',
      flight: '135  / 2.987 hours',
      training: '10  / 456 hours',
    },
    {
      month: 'May',
      flight: '120  / 2.456 hours',
      training: '20  / 856 hours',
    },
    {
      month: 'June',
      flight: '135  / 2.987 hours',
      training: '10  / 456 hours',
    },
    {
      month: 'July',
      flight: '120  / 2.456 hours',
      training: '20  / 856 hours',
    },
    {
      month: 'August',
      flight: '135  / 2.987 hours',
      training: '10  / 456 hours',
    },
    {
      month: 'September',
      flight: '120  / 2.456 hours',
      training: '20  / 856 hours',
    },
    {
      month: 'October',
      flight: '135  / 2.987 hours',
      training: '10  / 456 hours',
    },
    {
      month: 'November',
      flight: '120  / 2.456 hours',
      training: '20  / 856 hours',
    },
    {
      month: 'December',
      flight: '135  / 2.987 hours',
      training: '10  / 456 hours',
    },


  ];

  ngOnInit() {
    this.defineColumn();
  }

  defineColumn() {
    this.columns = [
      { field: 'month', header: 'Month' },
      { field: 'flight', header: 'Flight' },
      { field: 'training', header: 'Training' },
    ];
  }
}
