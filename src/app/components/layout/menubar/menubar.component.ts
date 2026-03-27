import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LayoutMenuItem } from '@shared/models/layout-sidebar-menu';
import { LoginService } from '@shared/services/login.service';
import { UserProfileService } from '@shared/services/user-profile.service';
import { environment } from '@environments/environment';

import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-menubar',
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    AvatarModule,
  ],
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
})
export class MenubarComponent implements OnInit {
  loginService = inject(LoginService);
  userProfileService = inject(UserProfileService);
  menuItems: LayoutMenuItem[] = [];
  username = '';
  profilePhotoUrl: string | null = null;
  platformId = inject(PLATFORM_ID);

  ngOnInit() {
    this.getUserInfo();
    this.definedMenu();
  }

  getUserInfo() {
    if (isPlatformBrowser(this.platformId)) {
      this.username = this.loginService?.currentUser()?.username || '{}';
      this.loadProfilePhoto();
    }
  }

  loadProfilePhoto() {
    this.userProfileService.getProfilePhoto().subscribe({
      next: (photoBlob) => {
        this.profilePhotoUrl = URL.createObjectURL(photoBlob);
      },
      error: (err) => {
        console.error('Profil fotoğrafı alınamadı:', err);
        this.profilePhotoUrl = null;
      },
    });
  }

  definedMenu() {
    const allMenuItems: LayoutMenuItem[] = [
      {
        label: 'Dashboard',
        icon: 'dashboard-icon.svg',
        path: '/',
      },
      {
        label: 'Flights',
        icon: 'flight-icon.svg',
        path: 'flight-information',
      },
      {
        label: 'Operational Reports',
        icon: 'operational-reports-icon.svg',
        items: [
          {
            label: 'Personal Checklists',
            icon: '',
            path: 'operational-reports/personal-checklists',
          },
          {
            label: 'Aircraft Checklists',
            icon: '',
            path: 'operational-reports/aircraft-checklists',
          },
          {
            label: 'Licence Infos',
            icon: '',
            path: 'operational-reports/licence-info',
          },
          {
            label: 'Flight Plans',
            icon: '',
            path: 'operational-reports/flight-plans',
          },
          {
            label: 'Trip Infos',
            icon: '',
            path: 'operational-reports/trip-information',
          },
          {
            label: 'Load Sheets',
            icon: '',
            path: 'operational-reports/load-sheet',
          },
          {
            label: 'Fuel Orders',
            icon: '',
            path: 'operational-reports/fuel',
          },
          {
            label: 'Crews',
            icon: '',
            path: 'operational-reports/crew-information',
          },
          {
            label: 'Reports',
            icon: '',
            path: 'operational-reports/report',
          },
          {
            label: 'GPS Loss Forms',
            icon: '',
            path: 'operational-reports/gps-loss-form',
          },
          {
            label: 'Routes',
            icon: '',
            path: 'operational-reports/route',
          },
        ],
      },
      {
        label: 'Logbook',
        icon: 'open-book.svg',
        items: [
          {
            label: 'Logbook',
            icon: '',
            path: 'logbook/logbook-main',
          },
          {
            label: 'Logbook Usage History',
            icon: '',
            path: 'logbook/logbook-usage-history',
          },
        ],
      },
      {
        label: 'Airport Information',
        icon: 'airport-icon.svg',
        path: 'airport-information',
      },
      {
        label: 'Aircraft Database',
        icon: 'aircraft-icon.svg',
        path: 'aircraft-database',
      },
      {
        label: 'User Login History',
        icon: 'user-icon.svg',
        path: 'user-login-history',
      },
    ];

    const prodOnlyMenuItems: LayoutMenuItem[] = [
      // {
      //   label: 'Dashboard',
      //   icon: 'dashboard-icon.svg',
      //   path: '/',
      // },
      // {
      //   label: 'Flights',
      //   icon: 'flight-icon.svg',
      //   path: 'flight-information',
      // },
      // {
      //   label: 'Operational Reports',
      //   icon: 'operational-reports-icon.svg',
      //   items: [
      //     {
      //       label: 'Personal Checklists',
      //       icon: '',
      //       path: 'operational-reports/personal-checklists',
      //     },
      //     {
      //       label: 'Aircraft Checklists',
      //       icon: '',
      //       path: 'operational-reports/aircraft-checklists',
      //     },
      //     {
      //       label: 'Licence Infos',
      //       icon: '',
      //       path: 'operational-reports/licence-info',
      //     },
      //     {
      //       label: 'Flight Plans',
      //       icon: '',
      //       path: 'operational-reports/flight-plans',
      //     },

      //     {
      //       label: 'Trip Infos',
      //       icon: '',
      //       path: 'operational-reports/trip-information',
      //     },

      //     {
      //       label: 'Load Sheets',
      //       icon: '',
      //       path: 'operational-reports/load-sheet',
      //     },

      //     {
      //       label: 'Fuel Orders',
      //       icon: '',
      //       path: 'operational-reports/fuel',
      //     },

      //     {
      //       label: 'Crews',
      //       icon: '',
      //       path: 'operational-reports/crew-information',
      //     },
      //     {
      //       label: 'Reports',
      //       icon: '',
      //       path: 'operational-reports/report',
      //     },

      //     {
      //       label: 'GPS Loss Forms',
      //       icon: '',
      //       path: 'operational-reports/gps-loss-form',
      //     },

      //     {
      //       label: 'Routes',
      //       icon: '',
      //       path: 'operational-reports/route',
      //     },
      //   ],
      // },

      {
        label: 'Logbook',
        icon: 'open-book.svg',
        items: [
          {
            label: 'Logbook',
            icon: '',
            path: 'logbook/logbook-main',
          },
          {
            label: 'Logbook Usage History',
            icon: '',
            path: 'logbook/logbook-usage-history',
          },
        ],
      },

      // {
      //   label: 'Airport Information',
      //   icon: 'airport-icon.svg',
      //   path: 'airport-information',
      // },
      // {
      //   label: 'Aircraft Database',
      //   icon: 'aircraft-icon.svg',
      //   path: 'aircraft-database',
      // },
      // {
      //   label: 'User Login History',
      //   icon: 'user-icon.svg',
      //   path: 'user-login-history',
      // },
    ];

    this.menuItems = environment.production ? prodOnlyMenuItems : allMenuItems;
  }

  logout() {
    this.loginService.logout();
  }
}
