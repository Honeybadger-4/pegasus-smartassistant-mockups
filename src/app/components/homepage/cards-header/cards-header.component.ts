import { Component, Input } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cards-header',
  standalone: true,
  imports: [DropdownModule, FormsModule],
  templateUrl: './cards-header.component.html',
  styleUrl: './cards-header.component.scss',
})
export class CardsHeaderComponent {
  @Input() title: string;
  dropdownOptions: { label: string; value: string }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];
  selectedOption: string = '';

  constructor() {
    this.title = '';
  }
}
