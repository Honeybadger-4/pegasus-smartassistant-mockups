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
      },
      {
        label: 'Flight Information',
        icon: 'flight-icon.svg',
        items: [
          {
            label: 'Fuel',
            icon: 'fuel-icon.svg',
          },
          {
            label: 'Route',
            icon: 'route-icon.svg',
          },
          {
            label: 'Trip Info',
            icon: 'trip-icon.svg',
          },
          {
            label: 'Load Sheet',
            icon: 'loadsheet-icon.svg',
          },
        ],
      },
      {
        label: 'Airport Information',
        icon: 'airport-icon.svg',
      },
      {
        label: 'Report',
        icon: 'report-icon.svg',
      },
      {
        label: 'User Login History',
        icon: 'user-icon.svg',
      },
      {
        label: 'Aircraft Database',
        icon: 'aircraft-icon.svg',
      }
    ];
  }

  onMenuClick(label: string) {
    this.selectedItem = label;
  }

  isActive(label: string) {
    return this.selectedItem === label;
  }

}  
