import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarMenuComponent } from '../components/layout/sidebar-menu/sidebar-menu.component';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    SidebarMenuComponent,
    ButtonModule,
    MenubarModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  sidebarVisible = false;

  toggleSidebarMenu() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
