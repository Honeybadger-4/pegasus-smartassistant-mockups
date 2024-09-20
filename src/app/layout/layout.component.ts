import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { LayoutMenuItem } from '@shared/models/layout-sidebar-menu'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenubarModule, MenuModule, PanelModule, DividerModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  menuItems: LayoutMenuItem[] = [];

  constructor() {}

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
      },
      {
        label: "Flight Information",
        icon: "pi pi-circle-off",
        items: [
          {
            label: "Fuel",
            icon: "pi pi-circle-off",
          },
          {
            label: "Route",
            icon: "pi pi-circle-off",
          },
          {
            label: "Trip Info",
            icon: "pi pi-circle-off",
          },
          {
            label: "Load Sheet",
            icon: "pi pi-circle-off",
          }
        ]
      },
      {
        label: 'Airport Information',
        icon: 'pi pi-circle-off',
      },
      {
        label: 'Report',
        icon: 'pi pi-circle-off',
      },
      {
        label: 'User Login History',
        icon: 'pi pi-circle-off',
      },
      {
        label: 'Aircraft Database',
        icon: 'pi pi-circle-off',
      },
    ];
  }
}
