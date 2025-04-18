import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-custom-bar-chart',
  imports: [ChartModule],
  templateUrl: './custom-bar-chart.component.html',
  styleUrl: './custom-bar-chart.component.scss',
})
export class CustomBarChartComponent implements OnInit {
  @Input() data: any;
  @Input() options: any;

  platformId = inject(PLATFORM_ID);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      this.cd.markForCheck();
    }
  }
}
