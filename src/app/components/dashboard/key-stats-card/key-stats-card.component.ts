import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-key-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-stats-card.component.html',
  styleUrl: './key-stats-card.component.scss'
})
export class KeyStatsCardComponent {
  stats = signal([
    { value: 24323, label: 'Total Flight Time' },
    { value: 234, label: 'GPS Loss Form Created' },
    { value: 2655, label: 'Flight Plan Created' },
  ]);
}
