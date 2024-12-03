import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LayoutMenuItem } from '@shared/models/layout-sidebar-menu';

import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [
    CommonModule, 
    MenubarModule, 
    ButtonModule,
    AvatarModule
  ],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss',
})
export class MenubarComponent {
  menuItems: LayoutMenuItem[] = [];

  ngOnInit() {
    this.definedMenu();
  }

  definedMenu() {
    this.menuItems = [
      {
        label: 'Homepage',
        icon: 'home-icon.svg',
        path: '',
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
        ]
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
        label: 'Logbook',
        icon: 'open-book.svg',
        path: 'logbook',
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
}
