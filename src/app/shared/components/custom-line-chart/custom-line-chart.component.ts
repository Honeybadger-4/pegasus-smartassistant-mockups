import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-custom-line-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './custom-line-chart.component.html',
  styleUrl: './custom-line-chart.component.scss',
})
export class CustomLineChartComponent {
  @Input() data: any;
  @Input() options: any;

  platformId = inject(PLATFORM_ID);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cd.markForCheck();
    }
  }
}
