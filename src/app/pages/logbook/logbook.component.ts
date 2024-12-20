import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoeingInfoComponent } from 'src/app/components/logbook-dashboard/boeing-info/boeing-info.component';
import { AirbusInfoComponent } from 'src/app/components/logbook-dashboard/airbus-info/airbus-info.component';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-logbook',
  standalone: true,
  imports: [
    BoeingInfoComponent,
    AirbusInfoComponent,
    DropdownModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './logbook.component.html',
  styleUrl: './logbook.component.scss',
})
export class LogbookComponent {
  selectedYear = '';
  yearOptions = [
    { label: '2022', value: '2022' },
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
  ];
}
