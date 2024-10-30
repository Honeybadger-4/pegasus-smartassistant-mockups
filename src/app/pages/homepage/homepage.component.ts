import { Component } from '@angular/core';
import { TotalFlightsComponent } from 'src/app/components/homepage/total-flights/total-flights.component';
import { GeneralInformationCardComponent } from 'src/app/components/homepage/general-information-card/general-information-card.component';
import { TopAlternateRoutesCardComponent } from "../../components/homepage/top-alternate-routes-card/top-alternate-routes-card.component";


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [TotalFlightsComponent, GeneralInformationCardComponent, TopAlternateRoutesCardComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {}

