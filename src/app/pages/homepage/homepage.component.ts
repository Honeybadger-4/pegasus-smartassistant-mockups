import { Component, inject } from '@angular/core';
import { GeneralInformationCardComponent } from 'src/app/components/homepage/general-information-card/general-information-card.component';
import { TopAlternateRoutesCardComponent } from '../../components/homepage/top-alternate-routes-card/top-alternate-routes-card.component';
import { TotalFlightsComponent } from 'src/app/components/homepage/total-flights/total-flights.component';
import { LoginService } from '@shared/services/login.service';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-homepage',
  imports: [
    TotalFlightsComponent,
    GeneralInformationCardComponent,
    TopAlternateRoutesCardComponent,
    DatePickerModule,
    FormsModule,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  dateRange: Date[] = [];

  loginService = inject(LoginService);

  ngOnInit() {
    console.log(this.loginService.currentUser());
  }
}
