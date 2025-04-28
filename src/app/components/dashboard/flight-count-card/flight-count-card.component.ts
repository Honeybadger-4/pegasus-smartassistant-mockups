import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomLineChartComponent } from '@shared/components/custom-line-chart/custom-line-chart.component';
import { FlightInformationService } from '@shared/services/flight-information.service';
import { DateRangeType } from 'src/app/pages/dashboard/dashboard.component';
import { getDateRange, getTitleSuffix } from '@shared/utils/date-range.util';
import moment from 'moment';

@Component({
  selector: 'app-flight-count-card',
  standalone: true,
  imports: [CommonModule, CustomLineChartComponent],
  templateUrl: './flight-count-card.component.html',
  styleUrl: './flight-count-card.component.scss',
})
export class FlightCountCardComponent implements OnChanges {
  @Input() selectedRange: DateRangeType = '6months';

  flightService = inject(FlightInformationService);

  titleSuffix = '';
  chartData = signal<any>(null);
  chartOptions = signal<any>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRange']) {
      this.titleSuffix = getTitleSuffix(this.selectedRange);
      this.loadFlightData();
    }
  }

  loadFlightData(): void {
    const { startDate, endDate } = getDateRange(this.selectedRange);

    this.flightService
      .getDailyCount(startDate, endDate)
      .subscribe((response) => {
        const groupedFlights = new Map<string, number>();

        response.forEach((flight) => {
          const monthLabel = moment(flight.day).format('MMMM');
          groupedFlights.set(
            monthLabel,
            (groupedFlights.get(monthLabel) || 0) + flight.total,
          );
        });

        const labels = Array.from(groupedFlights.keys());
        const values = Array.from(groupedFlights.values());

        this.chartData.set({
          labels,
          datasets: [
            {
              label: 'Flight Count',
              data: values,
              fill: false,
              borderColor: '#FEB914',
              backgroundColor: '#FEB914',
              tension: 0.4,
              pointRadius: 2,
              borderWidth: 2,
            },
          ],
        });

        this.chartOptions.set({
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: { bottom: 15 },
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              align: 'start',
              labels: {
                usePointStyle: true,
                pointStyle: 'rect',
                boxWidth: 10,
                boxHeight: 10,
                color: '#515B66',
              },
            },
          },
          scales: {
            x: {
              ticks: { color: '#515B66' },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: '#515B66',
                callback: (val: number) =>
                  val === 0 ? '00' : val / 1000 + 'k',
              },
              grid: { color: '#e0e0e0' },
            },
          },
        });
      });
  }
}
