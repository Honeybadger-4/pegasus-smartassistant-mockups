import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { LayoutMenuItem } from '@shared/models/layout-sidebar-menu';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    MenubarModule,
    PanelModule,
    DividerModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  menuItems: LayoutMenuItem[] = [];
  selectedItem: string = '';

  constructor() {}

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Homepage',
        icon: 'home-icon.svg',
        path: '',
      },
      {
        label: 'Flight Information',
        icon: 'flight-icon.svg',
        items: [
          {
            label: 'Fuel',
            icon: 'fuel-icon.svg',
            path: 'fuel',
          },
          {
            label: 'Route',
            icon: 'route-icon.svg',
            path: 'route',
          },
          {
            label: 'Trip Info',
            icon: 'trip-icon.svg',
            path: 'trip-info',
          },
          {
            label: 'Load Sheet',
            icon: 'loadsheet-icon.svg',
            path: 'load-sheet',
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
    ];
  }

  onMenuClick(label: string) {
    this.selectedItem = label;
  }

  isActive(label: string) {
    return this.selectedItem === label;
  }
}
