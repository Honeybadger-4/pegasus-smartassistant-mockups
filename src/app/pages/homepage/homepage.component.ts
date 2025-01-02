import { Component, inject } from '@angular/core';
import { GeneralInformationCardComponent } from 'src/app/components/homepage/general-information-card/general-information-card.component';
import { TopAlternateRoutesCardComponent } from '../../components/homepage/top-alternate-routes-card/top-alternate-routes-card.component';
import { TotalFlightsComponent } from 'src/app/components/homepage/total-flights/total-flights.component';
import { LoginService } from '@shared/services/login.service';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    TotalFlightsComponent,
    GeneralInformationCardComponent,
    TopAlternateRoutesCardComponent,
    CalendarModule,
    FormsModule,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  loginService = inject(LoginService);
  dateRange: Date[] = [];


  ngOnInit() {
    console.log(this.loginService.currentUser());
  }
}
