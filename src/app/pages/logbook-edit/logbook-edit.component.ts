import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Column } from '@shared/models/columns';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CustomBreadcrumbComponent } from '@shared/components/custom-breadcrumb/custom-breadcrumb.component';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
    CustomBreadcrumbComponent,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './logbook-edit.component.html',
  styleUrls: ['./logbook-edit.component.scss'],
})
export class LogbookEditComponent implements OnInit {
  editData: any;
  breadcrumbItems: MenuItem[] = [];
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
      companyId: '12345',
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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    const dataParam = this.route.snapshot.paramMap.get('data');
    if (dataParam) {
      this.editData = JSON.parse(dataParam);
      console.log(this.editData);
    }

    this.breadcrumbItems = [
      { label: 'Logbook', route: '/logbook' },
      { label: 'Edit Logbook' },
    ];

    this.builder();
  }

  builder() {
    this.logbookFormGroup = this.formBuilder.group({
      crewName: [this.editData.crewNameSurname || ''],
      companyId: [this.editData.companyId || ''],
      uploadDate: [this.editData.uploadDate || ''],
      acType: [this.editData.aircraftType || ''],
      acReg: [this.editData.aircraftReg || ''],
      status: [this.editData.status || ''],
      flightVersion: [''],
      aircraftType: [this.editData.aircraftType || ''],
      date: [''],
      aircraftReg: [this.editData.aircraftReg || ''],
      departure: [''],
      arrival: [''],
      departureTime: [''],
      arrivalTime: [''],
      se: [''],
      me: [''],
      namePic: [''],
      multiPilotTime: [''],
      totalTime: [''],
      day: [''],
      night: [''],
      instructor: [''],
      remarks: [''],
      pic: [''],
      coPilot: [''],
      time: [''],
      type: [''],
      duty: [''],
      ifr: [''],
    });
  }

  onSave(): void {
    this.confirmationService.confirm({
      message: `<div class="custom-confirm-content">
                  <div class="custom-confirm-icon">
                    <img src="/icons/approve-icon.svg" alt="Approve Icon" />
                  </div>
                  <p class="custom-confirm-message">Do you save edits made to the logbook document?</p>
                </div>`,
      header: '',
      icon: '',
      closeOnEscape: false,
      acceptLabel: 'Save',
      rejectLabel: 'Cancel',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'action-button',
      rejectButtonStyleClass: 'cancel-button',
      accept: () => {
        this.formSubmit();
      },
    });
  }

  formSubmit() {
    console.log('Form data:', this.logbookFormGroup.value);
  }
}
