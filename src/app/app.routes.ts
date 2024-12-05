import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginComponent } from './pages/login/login.component';
import { FlightInfoComponent } from './pages/flight-info/flight-info.component';
import { TripInfoComponent } from './pages/trip-info/trip-info.component';
import { FuelComponent } from './pages/fuel/fuel.component';
import { LoadSheetComponent } from './pages/load-sheet/load-sheet.component';
import { ReportComponent } from './pages/report/report.component';
import { UserLoginHistoryComponent } from './pages/user-login-history/user-login-history.component';
import { AirportInfoComponent } from './pages/airport-info/airport-info.component';
import { LogbookComponent } from './pages/logbook/logbook.component';
import { LogbookDetailComponent } from './pages/logbook-detail/logbook-detail.component';
import { LogbookDetailEditComponent } from './pages/logbook-detail-edit/logbook-detail-edit.component';
import { RouteComponent } from './pages/route/route.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomepageComponent,
      },
      {
        path: 'flight-information',
        children: [
          {
            path: '',
            component: FlightInfoComponent,
          },
          {
            path: 'trip-information',
            component: TripInfoComponent,
          },
          {
            path: 'fuel',
            component: FuelComponent,
          },
          {
            path: 'route',
            component: RouteComponent,
          },
          {
            path: 'load-sheet',
            component: LoadSheetComponent,
          },
        ],
      },
      {
        path: 'report',
        component: ReportComponent,
      },
      {
        path: 'user-login-history',
        component: UserLoginHistoryComponent,
      },
      {
        path: 'logbook',
        children: [
          {
            path: '',
            component: LogbookComponent,
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
    ],
  },
];
