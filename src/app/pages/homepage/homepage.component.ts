import { Component } from '@angular/core';
import { TotalFlightsComponent } from 'src/app/components/total-flights/total-flights.component';
import { CombinedChartsComponent } from 'src/app/components/combined-charts/combined-charts.component';
import { TopAlternateRoutesCardComponent } from "../../components/top-alternate-routes-card/top-alternate-routes-card.component";


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [TotalFlightsComponent, CombinedChartsComponent, TopAlternateRoutesCardComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {}

