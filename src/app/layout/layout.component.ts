import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

import { MenubarComponent } from '../components/layout/menubar/menubar.component';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
    selector: 'app-layout',
    imports: [CommonModule, RouterModule, MenubarComponent, ButtonModule, MenubarModule],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  sidebarVisible = false;

  toggleSidebarMenu() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
