import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core'; // OnInit burada doğru şekilde içe aktarılıyor
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';


import { CustomDonutChartComponent } from '../../../shared/components/custom-donut-chart/custom-donut-chart.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boeing-info',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent,CustomDonutChartComponent],
  templateUrl: './boeing-info.component.html',
  styleUrl: './boeing-info.component.scss',
})
export class BoeingInfoComponent implements OnInit  {
  router = inject(Router);
  
  columns: Column[] = [];


  boeingInfoData = [
    {
      month: 'January',
      flight: '120  / 2.456 hours',
      training: '20  / 856 hours',
    },
    {
      month: 'February',
      flight: '135  / 2.987 hours',
      training: '10  / 456 hours',
    },
    {
      month: 'March',
      flight: '120  / 2.456 hours',
      training: '20  / 856 hours',
    },
    {
      month: 'April',
      flight: '135  / 2.987 hours',
      training: '10  / 456 hours',
    },
    {
      month: 'May',
      flight: '120  / 2.456 hours',
      training: '20  / 856 hours',
    },
    {
      month: 'June',
      flight: '135  / 2.987 hours',
      training: '10  / 456 hours',
    },
    {
      month: 'July',
      flight: '120  / 2.456 hours',
      training: '20  / 856 hours',
    },
    {
      month: 'August',
      flight: '135  / 2.987 hours',
      training: '10  / 456 hours',
    },
    {
      month: 'September',
      flight: '120  / 2.456 hours',
      training: '20  / 856 hours',
    },
    {
      month: 'October',
      flight: '135  / 2.987 hours',
      training: '10  / 456 hours',
    },
    {
      month: 'November',
      flight: '120  / 2.456 hours',
      training: '20  / 856 hours',
    },
    {
      month: 'December',
      flight: '135  / 2.987 hours',
      training: '10  / 456 hours',
    },


  ];

  chartDataOne: any = {
    //labels: ['A', 'B', 'C'],
    datasets: [
      {
        data: [300, 50],
        backgroundColor: ['#5E548E', '#9F86C0'],
        hoverBackgroundColor: ['#5E548E', '#9F86C0'],
      },
    ],
  };

  chartOptionsOne: any = {
    cutout: '65%',
    plugins: {
      legend: {
        labels: {
          //color: "blue"
        },
      },
    },
  };

  chartDataTwo: any = {
    //labels: ['A', 'B', 'C'],
    datasets: [
      {
        data: [300, 50],
        backgroundColor: ['#31572C', '#4F772D'],
        hoverBackgroundColor: ['#31572C', '#4F772D'],
      },
    ],
  };

  chartOptionsTwo: any = {
    cutout: '65%',
    plugins: {
      legend: {
        labels: {
          //color: "blue"
        },
      },
    },
  };

  ngOnInit() {
    this.defineColumn();
  }

  defineColumn() {
    this.columns = [
      { field: 'month', header: 'Month' },
      { field: 'flight', header: 'Flight' },
      { field: 'training', header: 'Training' },
    ];
  }

  tableRowSelected(event: any) {
    this.router.navigate(['logbook/crew-list'], {
      state: { data: event },
    });
  }
}





