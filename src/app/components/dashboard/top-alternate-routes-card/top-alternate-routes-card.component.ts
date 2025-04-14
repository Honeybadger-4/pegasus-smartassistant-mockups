import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-alternate-routes-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-alternate-routes-card.component.html',
  styleUrl: './top-alternate-routes-card.component.scss'
})
export class TopAlternateRoutesCardComponent {
  routeList = signal([
    { route: 'Route 1', fromTo: 'From-to', count: 12 },
    { route: 'Route 2', fromTo: 'From-to', count: 42 },
    { route: 'Route 3', fromTo: 'From-to', count: 23 },
    { route: 'Route 4', fromTo: 'From-to', count: 54 },
    { route: 'Route 5', fromTo: 'From-to', count: 33 },
  ]);
}
