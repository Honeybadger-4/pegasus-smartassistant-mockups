import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LayoutMenuItem } from '@shared/models/layout-sidebar-menu';
import { LoginService } from '@shared/services/login.service';
import { UserProfileService } from '@shared/services/user-profile.service';

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
export class MenubarComponent {
  loginService = inject(LoginService);
  userProfileService = inject(UserProfileService);
  menuItems: LayoutMenuItem[] = [];
  username: string = '';
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
    this.menuItems = [
      {
        label: 'Homepage',
        icon: 'home-icon.svg',
        path: '',
      },
      {
        label: 'Logbook',
        icon: 'open-book.svg',
        path: 'logbook',
      },
      {
        label: 'Flight Info',
        icon: 'flight-icon.svg',
        path: 'flight-information',
        items: [
          {
            label: 'Fuel',
            icon: 'fuel-icon.svg',
            path: 'flight-information/fuel',
          },
          {
            label: 'Route',
            icon: 'route-icon.svg',
            path: 'flight-information/route',
          },
          {
            label: 'Trip Info',
            icon: 'trip-icon.svg',
            path: 'flight-information/trip-information',
          },
          {
            label: 'Load Sheet',
            icon: 'loadsheet-icon.svg',
            path: 'flight-information/load-sheet',
          },
        ],
      },
      {
        label: 'Airport Information',
        icon: 'airport-icon.svg',
        path: 'airport-information',
      },
      {
        label: 'Report',
        icon: 'report-icon.svg',
        path: 'report',
      },
      {
        label: 'User Login History',
        icon: 'user-icon.svg',
        path: 'user-login-history',
      },
      {
        label: 'Aircraft Database',
        icon: 'aircraft-icon.svg',
        path: 'aircraft-database',
      },
      {
        label: 'Management',
        icon: 'management-icon.svg',
        path: 'management',
      },
    ];
  }

  logout() {
    this.loginService.logout();
  }
}
