import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-custom-breadcrumb',
  imports: [BreadcrumbModule, RouterModule, CommonModule],
  templateUrl: './custom-breadcrumb.component.html',
  styleUrl: './custom-breadcrumb.component.scss',
})
export class CustomBreadcrumbComponent {
  @Input() breadCrumbItems: MenuItem[] | undefined;
}
