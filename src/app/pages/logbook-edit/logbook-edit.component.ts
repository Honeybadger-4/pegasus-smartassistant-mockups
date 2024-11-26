import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-logbook-edit',
  standalone: true,
  imports: [
    BreadcrumbModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
  ],
  templateUrl: './logbook-edit.component.html',
  styleUrls: ['./logbook-edit.component.scss'],
})
export class LogbookEditComponent implements OnInit {
  editData: any;
  breadcrumbItems: { label: string; url?: string }[] = [];
  columns: Column[] = [];
  logbookFormGroup!: FormGroup;
  logbookData = [
    {
      crewName: 'John Doe',
      companyId: '12345',
      uploadDate: '2024-11-26',
      acType: 'B737',
      acReg: 'TC-ABC',
      status: 'APPROVED',
      flightVersion: 'Flight',
      date: '26.07.2019',
      departure: 'SAW',
      arrival: 'ADB',
      departureTime: '05:05',
      arrivalTime: '06:14',
      remarks: '-',
    },
    {
      crewName: 'Jane Smith',
      companyId: '67890',
      uploadDate: '2024-11-25',
      acType: 'A320',
      acReg: 'TC-XYZ',
      status: 'PENDING',
      flightVersion: 'Test',
      date: '27.07.2019',
      departure: 'IST',
      arrival: 'ANK',
      departureTime: '08:00',
      arrivalTime: '09:00',
      remarks: 'Test remarks',
    },
  ];

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit() {
    const dataParam = this.route.snapshot.paramMap.get('data');
    if (dataParam) {
      this.editData = JSON.parse(dataParam);
      console.log(this.editData);
    }

    this.breadcrumbItems = [
      { label: 'Logbook', url: '/logbook' },
      { label: 'Edit Logbook' },
    ];

    this.builder();
    this.defineColumn();
  }
  builder() {
    this.logbookFormGroup = this.formBuilder.group({
      crewName: [''],
      companyId: [''],
      uploadDate: [''],
      acType: [''],
      acReg: [''],
      status: [''],
      flightVersion: [''],
      date: [''],
      departure: [''],
      arrival: [''],
      departureTime: [''],
      arrivalTime: [''],
      remarks: [''],
    });
  }

  defineColumn() {
    this.columns = [
      { field: 'crewName', header: 'Crew Name & Surname' },
      { field: 'companyId', header: 'Company ID' },
      { field: 'uploadDate', header: 'Upload Date' },
      { field: 'acType', header: 'A/C Type' },
      { field: 'acReg', header: 'A/C Reg' },
      { field: 'status', header: 'Status' },
      { field: 'flightVersion', header: 'Flight Version' },
      { field: 'date', header: 'Date' },
      { field: 'departure', header: 'Departure' },
      { field: 'arrival', header: 'Arrival' },
      { field: 'departureTime', header: 'Departure Time' },
      { field: 'arrivalTime', header: 'Arrival Time' },
      { field: 'remarks', header: 'Remarks And Endorsements' },
    ];
  }

  onSave() {
    console.log('Form data:', this.logbookFormGroup.value);
  }
}