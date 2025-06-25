import { Component, inject, signal } from '@angular/core';
import {
  CgLimitsEnvelopes,
  GetCgLimitsResponseModel,
} from '@shared/models/cg-limits-response.model';
import { CgLimitsService } from '@shared/services/bff/cg-limits.service';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-cg-limits-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './cg-limits-chart.component.html',
  styleUrl: './cg-limits-chart.component.scss',
})
export class CgLimitsChartComponent {
  private cgLimitsService = inject(CgLimitsService);

  cgLimitsData = signal<GetCgLimitsResponseModel | null>(null);
  chartData = signal<any>(null);
  chartOptions: any;

  ngOnInit(): void {
    this.fetchCgLimits();
    this.initializeChart();
  }

  initializeChart(): void {
    this.chartOptions = {
      responsive: true,
      scales: {
        x: {
          min: 0,
          max: 130,
          grid: { color: '#fff' },
          ticks: { color: 'white' },
        },
        y: {
          min: 25000,
          max: 100000,
          grid: { color: 'gray' },
          ticks: { color: 'white' },
        },
      },
    };
  }

  fetchCgLimits(): void {
    // TODO: Loadsheet'in legIsn bilgisi alınıp istek o şekilde atılmalı.
    this.cgLimitsService.getCgLimits('14503268').subscribe({
      next: (response) => {
        this.cgLimitsData.set(response);
        this.chartData.set(this.transformToChartData(response));
      },
      error: (error) => {
        console.error('Error fetching CG limits:', error);
      },
    });
  }

  transformToChartData(data: GetCgLimitsResponseModel) {
    const datasets = [];

    const envelopes = [
      { type: 'ZFW', label: 'ZFW Envelope', color: 'rgba(255, 0, 0, 1)' },
      {
        type: 'TAKE_OFF',
        label: 'Takeoff Envelope',
        color: 'rgba(0, 255, 0, 1)',
      },
      {
        type: 'LANDING',
        label: 'Landing Envelope',
        color: 'rgba(0, 0, 255, 1)',
      },
    ];

    for (const env of envelopes) {
      const found = data.envelopes?.find(
        (e: any) => e.envelopeIndexType === env.type,
      );

      if (found) {
        datasets.push(
          ...this.buildEnvelopeDataset(
            env.label,
            found.envelopeUnits,
            env.color,
          ),
        );
      }
    }

    // CG dots and lines
    datasets.push(
      this.buildPoint(
        'ZFW',
        data.zfw.weightIndex,
        data.zfw.weight,
        'rgba(255, 0, 0, 1)',
      ),
    );
    datasets.push(
      this.buildPoint(
        'TOW',
        data.tow.weightIndex,
        data.tow.weight,
        'rgba(0, 255, 0, 1)',
      ),
    );
    datasets.push(
      this.buildPoint(
        'LW',
        data.lw.weightIndex,
        data.lw.weight,
        'rgba(0, 0, 255, 1)',
      ),
    );
    datasets.push(this.buildCGLine('CG1', data.cg1));
    datasets.push(this.buildCGLine('CG2', data.cg2));

    return { datasets };
  }

  buildEnvelopeDataset(
    label: string,
    units: CgLimitsEnvelopes['envelopeUnits'],
    color: string,
  ): any[] {
    const aftPoints = units
      .filter((u) => u.envelopeType === 'AFT')
      .map((u) => ({ x: u.weightIndex, y: u.weight }));

    const forwardPoints = units
      .filter((u) => u.envelopeType === 'FORWARD')
      .map((u) => ({ x: u.weightIndex, y: u.weight }));

    return [
      {
        label: `${label} - AFT`,
        data: aftPoints,
        borderColor: color,
        backgroundColor: color,
        fill: false,
        tension: 0,
        pointRadius: 6,
        borderWidth: 2,
        showLine: true,
      },
      {
        label: `${label} - FORWARD`,
        data: forwardPoints,
        borderColor: color,
        backgroundColor: color,
        fill: false,
        tension: 0,
        pointRadius: 6,
        borderWidth: 2,
        showLine: true,
      },
    ];
  }

  buildPoint(label: string, x: number, y: number, color: string): any {
    return {
      label,
      data: [{ x, y }],
      backgroundColor: color,
      pointRadius: 6,
      borderWidth: 1,
    };
  }

  buildCGLine(label: string, points: any[]): any {
    return {
      label,
      data: points.map((cg) => ({ x: cg.weightIndex, y: cg.weight })),
      fill: false,
      borderWidth: 2,
      borderColor: 'white',
      backgroundColor: 'white',
      pointRadius: 6,
      showLine: true,
    };
  }
}
