import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';

import {
  CgLimitsEnvelopes,
  GetCgLimitsResponseModel,
} from '@shared/models/cg-limits-response.model';
import { CgLimitsService } from '@shared/services/bff/cg-limits.service';

import { ChartModule } from 'primeng/chart';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-cg-limits-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, ProgressSpinner],
  templateUrl: './cg-limits-chart.component.html',
  styleUrl: './cg-limits-chart.component.scss',
})
export class CgLimitsChartComponent {
  private cgLimitsService = inject(CgLimitsService);
  legIsn = input('');
  cgLimitsData = signal<GetCgLimitsResponseModel | null>(null);
  chartData = signal<any>(null);
  chartLoading = signal<boolean>(true);
  chartOptions: any;

  ngOnInit(): void {
    this.fetchCgLimits();
    this.initializeChart();
  }

  // Aktif seçili grup (legend tıklama için)
  activeGroup: string | null = null;

  initializeChart(): void {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            // Legend'da gösterilecek grupları ve renklerini özelleştirir
            generateLabels: (chart: any) => {
              const groups = ['ZFW', 'TOW', 'LW', 'CG1', 'CG2'];
              return groups.map((group) => ({
                color: 'white',
                text: group,
                fillStyle:
                  chart.data.datasets.find(
                    (d: any) => d.customGroup === group || d.label === group,
                  )?.backgroundColor || 'white',
                hidden: false,
                group,
              }));
            },
          },
          title: {
            display: true,
            text: '',
            color: 'white',
          },
          // Legend'a tıklanınca sadece ilgili grubu vurgular
          onClick: (e: any, legendItem: any, legend: any) => {
            const chart = legend.chart;
            const group = legendItem.group;
            const datasets = chart.data.datasets;

            // Aynı gruba tekrar tıklanırsa tüm grupları göster
            if (this.activeGroup === group) {
              this.activeGroup = null;
            } else {
              this.activeGroup = group;
            }

            // Dataset'lerin renklerini aktif gruba göre değiştir
            datasets.forEach((ds: any) => {
              const isInGroup = ds.customGroup === group || ds.label === group;

              // Yedek renk yoksa yedekle (orijinal rengi koru)
              ds.originalBorderColor ||= ds.borderColor;
              ds.originalBackgroundColor ||= ds.backgroundColor;

              // Aktif grup dışındakileri soluklaştır
              ds.borderColor =
                isInGroup || !this.activeGroup
                  ? ds.originalBorderColor
                  : 'rgba(255,255,255,0.3)';
              ds.backgroundColor =
                isInGroup || !this.activeGroup
                  ? ds.originalBackgroundColor
                  : 'rgba(255,255,255,0.3)';
            });

            chart.update();
          },
        },
      },
      scales: {
        x: {
          min: 0,
          max: 130,
          grid: { color: 'gray' },
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
    this.cgLimitsService.getCgLimits(this.legIsn()).subscribe({
      next: (response) => {
        this.cgLimitsData.set(response);
        // Chart.js'e uygun formata dönüştürüp ata
        this.chartData.set(this.transformToChartData(response));
        this.chartLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching CG limits:', error);
        this.chartLoading.set(false);
      },
    });
  }

  /**
   * API'den gelen veriyi Chart.js'in beklediği dataset formatına dönüştürür.
   * - ZFW, TOW, LW için envelope poligonları ve noktaları ekler
   * - CG1 ve CG2 çizgilerini ekler
   */
  transformToChartData(data: GetCgLimitsResponseModel) {
    const datasets = [];

    // Envelope poligonları için renk ve label eşlemesi
    const envelopes = [
      { type: 'ZFW', label: 'ZFW', color: 'rgba(255, 0, 0, 1)' },
      { type: 'TAKE_OFF', label: 'TOW', color: 'rgba(0, 255, 0, 1)' },
      { type: 'LANDING', label: 'LW', color: 'rgba(0, 0, 255, 1)' },
    ];

    // Her envelope için dataset oluştur
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
            env.label,
          ),
        );
      }
    }

    // ZFW, TOW, LW noktalarını ekle
    datasets.push(
      this.buildPoint(
        'ZFW',
        data.zfw.weightIndex,
        data.zfw.weight,
        'rgba(255, 0, 0, 1)',
        'ZFW',
      ),
    );
    datasets.push(
      this.buildPoint(
        'TOW',
        data.tow.weightIndex,
        data.tow.weight,
        'rgba(0, 255, 0, 1)',
        'TOW',
      ),
    );
    datasets.push(
      this.buildPoint(
        'LW',
        data.lw.weightIndex,
        data.lw.weight,
        'rgba(0, 0, 255, 1)',
        'LW',
      ),
    );

    // CG1 ve CG2 çizgilerini ekle
    datasets.push(this.buildCGLine('CG1', data.cg1, 'CG1'));
    datasets.push(this.buildCGLine('CG2', data.cg2, 'CG2'));

    return { datasets };
  }

  /**
   * Envelope poligonlarını (AFT ve FORWARD) Chart.js dataset formatına dönüştürür
   * @param label ZFW/TOW/LW
   * @param units Envelope noktaları
   * @param color Çizgi ve nokta rengi
   * @param group Grup adı (legend için)
   */
  buildEnvelopeDataset(
    label: string,
    units: CgLimitsEnvelopes['envelopeUnits'],
    color: string,
    group: string,
  ): any[] {
    // AFT noktalarını al
    const aftPoints = units
      .filter((u) => u.envelopeType === 'AFT')
      .map((u) => ({ x: u.weightIndex, y: u.weight }));

    // FORWARD noktalarını al
    const forwardPoints = units
      .filter((u) => u.envelopeType === 'FORWARD')
      .map((u) => ({ x: u.weightIndex, y: u.weight }));

    // Her iki çizgiyi ayrı dataset olarak döndür
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
        customGroup: group,
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
        customGroup: group,
      },
    ];
  }

  /**
   * Tek bir noktayı (ör: ZFW, TOW, LW) Chart.js dataset formatına dönüştürür
   * @param label Nokta label'ı
   * @param x X değeri (weightIndex)
   * @param y Y değeri (weight)
   * @param color Nokta rengi
   * @param group Grup adı (legend için)
   */
  buildPoint(
    label: string,
    x: number,
    y: number,
    color: string,
    group: string,
  ): any {
    return {
      label,
      data: [{ x, y }],
      backgroundColor: color,
      pointRadius: 6,
      borderWidth: 1,
      customGroup: group,
    };
  }

  /**
   * CG1 ve CG2 çizgilerini Chart.js dataset formatına dönüştürür
   * @param label CG1/CG2
   * @param points Nokta dizisi
   * @param group Grup adı (legend için)
   */
  buildCGLine(label: string, points: any[], group: string): any {
    return {
      label,
      data: points.map((cg) => ({ x: cg.weightIndex, y: cg.weight })),
      fill: false,
      borderWidth: 2,
      borderColor: 'white',
      backgroundColor: 'white',
      pointRadius: 6,
      showLine: true,
      customGroup: group,
    };
  }
}
