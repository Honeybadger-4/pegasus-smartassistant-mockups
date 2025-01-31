import { Component, effect, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDonutChartComponent } from '../../../shared/components/custom-donut-chart/custom-donut-chart.component';
import { IFlightInfoStatsResponse } from '@shared/models/flight-info-stats-response.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-total-flights',
  imports: [CommonModule, CustomDonutChartComponent, ProgressSpinnerModule],
  templateUrl: './total-flights.component.html',
  styleUrls: ['./total-flights.component.scss'],
})
export class TotalFlightsComponent implements OnInit {
  totalFlightsData = input<IFlightInfoStatsResponse | null>(null);
  totalFlightsCardLoading = input<boolean>(false);

  chartDataOne = signal<any>({
    datasets: [
      {
        data: [0, 0 ,0],
        backgroundColor: ['#F79009', '#FED447', '#D62828'],
        hoverBackgroundColor: ['#F79009', '#FED447', '#D62828'],
        borderWidth: 0,
      },
    ],
  });

  chartOptionsOne: any = {
    cutout: '60%',
    plugins: {
      legend: {
        labels: {
          //color: "blue"
        },
      },
    },
  };

  chartDataTwo = signal<any>({
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#3D348B','#7678ED', '#092FF7'],
        hoverBackgroundColor: ['#3D348B','#7678ED', '#092FF7'],
        borderWidth: 0,
      },
    ],
  });

  chartOptionsTwo: any = {
    cutout: '60%',
    plugins: {
      legend: {
        labels: {
          //color: "blue"
        },
      },
    },
  };

  constructor() {
    effect(() => {
      this.defineChartDataOne();
      this.defineChartDataTwo();
    });
  }

  ngOnInit(): void {}

  defineChartDataOne() {
    if(this.totalFlightsData()) {
      this.chartDataOne.update((chartData) => {
        console.log(chartData);
        return {
          ...chartData,
          datasets: [{
            ...chartData.datasets[0],
            data: [this.totalFlightsData()?.approvedFlightPlans, this.totalFlightsData()?.approvedLoadSheets, this.totalFlightsData()?.sentTripInfo],
          }]
        }
      })
    }else {
      this.chartDataOne.update((chartData) => {
        return {
          ...chartData,
          datasets: [{
            ...chartData.datasets[0],
            data: [0, 0, 0],
          }]
        }
      })
    }
  }

  defineChartDataTwo() {
    if(this.totalFlightsData()) {
      this.chartDataTwo.update((chartData) => {
        return {
          ...chartData,
          datasets: [{
            ...chartData.datasets[0],
            data: [this.totalFlightsData()?.sentFuelOrder, this.totalFlightsData()?.lmcLoadSheets, this.totalFlightsData()?.gpsLossForm],            
          }]
        }
      })
    }else {
      this.chartDataTwo.update((chartData) => {
        return {
          ...chartData,
          datasets: [{
            ...chartData.datasets[0],
            data: [0, 0, 0],
          }]
        }
      })
    }
  }
}
