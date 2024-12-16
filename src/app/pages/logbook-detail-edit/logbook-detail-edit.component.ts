import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CustomBreadcrumbComponent } from '@shared/components/custom-breadcrumb/custom-breadcrumb.component';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

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
    DialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './logbook-detail-edit.component.html',
  styleUrls: ['./logbook-detail-edit.component.scss'],
})
export class LogbookDetailEditComponent implements OnInit {
  editData: any;
  breadcrumbItems: MenuItem[] = [];
  logbookFormGroup!: FormGroup;
  isEditMode = false;
  rejectReason: string = '';
  displayRejectPopup: boolean = false;
  selectedRow: any;
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
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.editData = history.state.data;
    console.log(this.editData);

    this.breadcrumbItems = [
      { label: 'Logbook', route: '/logbook' },
      { label: 'Crew List', route: '/logbook/crew-list' },
      { label: 'Logbook Detail List', route: '/logbook/logbook-detail' },
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
    this.logbookFormGroup.disable();
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
        this.toggleEditMode();
      },
    });
  }

  formSubmit() {
    if (this.logbookFormGroup.valid) {
      console.log('Form data:', this.logbookFormGroup.value);
    } else {
      console.error('Form is invalid');
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      this.logbookFormGroup.enable();
    } else {
      this.logbookFormGroup.disable();
    }
  }

  onApprove(rowData: any): void {
    this.confirmationService.confirm({
      message: `<div class="custom-confirm-content">
                  <div class="custom-confirm-icon">
                    <img src="/icons/approve-icon.svg" alt="Approve Icon" />
                  </div>
                  <p class="custom-confirm-message">Do you want to approve the logbook document?</p>
                </div>`,
      header: '',
      icon: '',
      closeOnEscape: false,
      acceptLabel: 'Approve',
      rejectLabel: 'Cancel',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'action-button',
      rejectButtonStyleClass: 'cancel-button',
      accept: () => {
        console.log('Approved:', rowData);
      },
      reject: () => {
        console.log('Approval cancelled.');
      },
    });
  }

  submitRejectReason(): void {
    this.displayRejectPopup = false;

    let rejectReguestBody = {
      selectedLogBook: this.editData,
      rejectReason: this.rejectReason,
    };

    this.onReject(rejectReguestBody);
  }

  onReject(data: any): void {
    this.confirmationService.confirm({
      message: `<div class="custom-confirm-content">
                  <div class="custom-confirm-icon">
                    <img src="/icons/reject_icon.svg" alt="Reject Icon" />
                  </div>
                  <p class="custom-confirm-message">Do you want to reject the logbook document?</p>
                </div>`,
      header: '',
      icon: '',
      closeOnEscape: false,
      acceptLabel: 'Reject',
      rejectLabel: 'Cancel',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'action-button',
      rejectButtonStyleClass: 'cancel-button',
      accept: () => {
        console.log(data);
      },
      reject: () => {
        console.log('Rejection cancelled.');
      },
    });
  }
}
