import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { FlightInfoComponent } from './pages/flight-info/flight-info.component';
import { TripInfoComponent } from './pages/trip-info/trip-info.component';
import { FuelOrderComponent } from './pages/fuel-order/fuel-order.component';
import { LoadSheetComponent } from './pages/load-sheet/load-sheet.component';
import { ReportComponent } from './pages/report/report.component';
import { UserLoginHistoryComponent } from './pages/user-login-history/user-login-history.component';
import { AirportInfoComponent } from './pages/airport-info/airport-info.component';
import { CrewListComponent } from './pages/crew-list/crew-list.component';
import { LogbookDetailComponent } from './pages/logbook-detail/logbook-detail.component';
import { LogbookDetailEditComponent } from './pages/logbook-detail-edit/logbook-detail-edit.component';
import { RoutesComponent } from './pages/routes/routes.component';
import { authGuard } from '@shared/guards/auth.guard';
import { LogbookComponent } from './pages/logbook/logbook.component';
import { PersonalChecklistsComponent } from './pages/personal-checklists/personal-checklists.component';
import { LicenceInfoComponent } from './pages/licence-info/licence-info.component';
import { FlightPlansComponent } from './pages/flight-plans/flight-plans.component';
import { GpsLossFormsComponent } from './pages/gps-loss-forms/gps-loss-forms.component';
import { CrewInformationComponent } from './pages/crew-information/crew-information.component';
import { AircraftChecklistComponent } from './pages/aircraft-checklist/aircraft-checklist.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },

      {
        path: 'flight-information',
        component: FlightInfoComponent,
      },

      {
        path: 'operational-reports',
        children: [
          {
            path: 'personal-checklists',
            component: PersonalChecklistsComponent,
          },
          { path: 'licence-info', component: LicenceInfoComponent },
          {
            path: 'aircraft-checklists',
            component: AircraftChecklistComponent,
          },
          { path: 'flight-plans', component: FlightPlansComponent },

          { path: 'fuel', component: FuelOrderComponent },
          { path: 'route', component: RoutesComponent },
          { path: 'trip-information', component: TripInfoComponent },
          { path: 'load-sheet', component: LoadSheetComponent },
          { path: 'crew-information', component: CrewInformationComponent },

          { path: 'report', component: ReportComponent },
          { path: 'gps-loss-form', component: GpsLossFormsComponent },
        ],
      },

      {
        path: 'logbook',
        children: [
          {
            path: '',
            component: LogbookComponent,
          },
          {
            path: 'crew-list',
            component: CrewListComponent,
          },
          {
            path: 'logbook-detail',
            component: LogbookDetailComponent,
          },
          {
            path: 'logbook-detail-edit',
            component: LogbookDetailEditComponent,
          },
        ],
      },
      {
        path: 'airport-information',
        component: AirportInfoComponent,
      },
      {
        path: 'user-login-history',
        component: UserLoginHistoryComponent,
      },
    ],
  },
];
