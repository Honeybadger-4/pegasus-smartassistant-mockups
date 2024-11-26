import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Column } from '@shared/models/columns';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';

@Component({
  selector: 'app-airport-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    CustomTableComponent,
  ],
  templateUrl: './airport-info.component.html',
  styleUrl: './airport-info.component.scss',
})
export class AirportInfoComponent {
  columns: Column[] = [];
  airportInfoFormGroup!: FormGroup;

  airportInfoData = [
    {
      name: 'ADNAN MENDERES 1',
      iata: 'ADB',
      icao: 'LTBJ',
      city: 'IZMIR',
      state: 'TUR',
    },
    {
      name: 'ADNAN MENDERES 2',
      iata: 'ADB',
      icao: 'LTBJ',
      city: 'IZMIR',
      state: 'TUR',
    },
    {
      name: 'ADNAN MENDERES 3',
      iata: 'ADB',
      icao: 'LTBJ',
      city: 'IZMIR',
      state: 'TUR',
    },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.builder();
    this.defineColumn();
  }

  builder() {
    this.airportInfoFormGroup = this.formBuilder.group({
      city: [''],
      category: [''],
      iata: [''],
      name: [''],
      approachCategory: [''],
      icao: [''],
      state: [''],
      fireCategory: [''],
      winterWh: [''],
      summerWh: [''],
    });
  }

  defineColumn() {
    this.columns = [
      { field: 'name', header: 'Name' },
      { field: 'iata', header: 'IATA' },
      { field: 'icao', header: 'ICAO' },
      { field: 'city', header: 'City' },
      { field: 'state', header: 'State' },
    ];
  }

  formSubmit() {
    console.log(this.airportInfoFormGroup);
  }
}
