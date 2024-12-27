import { Component, inject } from '@angular/core';
import { GeneralInformationCardComponent } from 'src/app/components/homepage/general-information-card/general-information-card.component';
import { TopAlternateRoutesCardComponent } from '../../components/homepage/top-alternate-routes-card/top-alternate-routes-card.component';
import { TotalFlightsComponent } from 'src/app/components/homepage/total-flights/total-flights.component';
import { LoginService } from '@shared/services/login.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    TotalFlightsComponent,
    GeneralInformationCardComponent,
    TopAlternateRoutesCardComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  loginService = inject(LoginService);

  ngOnInit() {
    console.log(this.loginService.currentUser());
  }
}
