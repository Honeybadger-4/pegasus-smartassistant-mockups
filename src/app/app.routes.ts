import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginComponent } from './pages/login/login.component';
import { FlightInfoComponent } from './pages/flight-info/flight-info.component';

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
        component: FlightInfoComponent,
      },
    ],
  },
];
