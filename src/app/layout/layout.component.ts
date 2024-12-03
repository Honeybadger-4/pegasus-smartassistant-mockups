import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenubarComponent } from '../components/layout/menubar/menubar.component';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MenubarComponent,
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
