import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-header',
  standalone: true,
  imports: [],
  templateUrl: './cards-header.component.html',
  styleUrl: './cards-header.component.scss',
})
export class CardsHeaderComponent {
  @Input() title: string;

  constructor() {
    this.title = '';
  }
}
