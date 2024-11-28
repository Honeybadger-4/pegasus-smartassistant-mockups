import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LayoutMenuItem } from '@shared/models/layout-sidebar-menu';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { Sidebar } from 'primeng/sidebar';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, PanelModule, MenubarModule, ButtonModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss',
})
export class SidebarMenuComponent {
  @Input() sidebarRef!: Sidebar;
  menuItems: LayoutMenuItem[] = [];
  panelIsCollapsed: boolean = true;

  constructor() {}

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
        label: 'Flight Information',
        icon: 'flight-icon.svg',
        items: [
          {
            label: 'Flight Info',
            icon: 'flight-icon.svg',
            path: 'flight-information',
          },
          {
            label: 'Fuel',
            icon: 'fuel-icon.svg',
            path: 'flight-information/fuel',
          },
          {
            label: 'Route',
            icon: 'route-icon.svg',
            path: 'route',
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
        label: 'Logbook',
        icon: 'open-book.svg',
        path: 'logbook',
      },
      {
        label: 'Aircraft Database',
        icon: 'aircraft-icon.svg',
        path: 'aircraft-database',
      },
    ];
  }

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }
}
