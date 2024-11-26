import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-custom-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule],
  templateUrl: './custom-breadcrumb.component.html',
  styleUrl: './custom-breadcrumb.component.scss',
})
export class CustomBreadcrumbComponent {
  @Input() breadCrumbItems: MenuItem[] | undefined;
}
