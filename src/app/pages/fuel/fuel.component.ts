import { Component } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-fuel',
  standalone: true,
  imports: [CommonModule, DropdownModule, IconFieldModule, InputIconModule, InputTextModule, FormsModule],
  templateUrl: './fuel.component.html',
  styleUrl: './fuel.component.scss'
})
export class FuelComponent {
  selectedFuelOrder: string = '';
  selectedDaily: string = '';

  fuelOrderOptions = [
    { label: 'Fuel Order 1', value: 'order1' },
    { label: 'Fuel Order 2', value: 'order2' },
    { label: 'Fuel Order 3', value: 'order3' }
  ];

  dailyOptions = [
    { label: 'Daily 1', value: 'daily1' },
    { label: 'Daily 2', value: 'daily2' },
    { label: 'Daily 3', value: 'daily3' }
  ];

}

