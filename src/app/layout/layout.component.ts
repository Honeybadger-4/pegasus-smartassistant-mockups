import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { SidebarMenuComponent } from '../components/layout/sidebar-menu/sidebar-menu.component';
import { Sidebar, SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    SidebarMenuComponent,
    AvatarModule,
    ButtonModule,
    MenubarModule,
    SidebarModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  sidebarVisible: boolean = false;

  constructor() {}

  ngOnInit() {}

  toggleSidebarMenu() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
