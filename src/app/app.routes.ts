import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginComponent } from './pages/login/login.component';
import { FlightInfoComponent } from './pages/flight-info/flight-info.component';
import { TripInfoComponent } from './pages/trip-info/trip-info.component';
import { FuelComponent } from './pages/fuel/fuel.component';
import { LoadSheetComponent } from './pages/load-sheet/load-sheet.component';
import { ReportComponent } from './pages/report/report.component';

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
            path: 'load-sheet',
            component: LoadSheetComponent,
          },
        ],
      },
      {
        path: 'report',
        component: ReportComponent,
      }
    ],
  },
];
