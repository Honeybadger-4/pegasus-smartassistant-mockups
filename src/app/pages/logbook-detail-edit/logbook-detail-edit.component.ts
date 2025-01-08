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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { IDetailedListContentData } from '@shared/models/detailed-list-response.model';

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
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './logbook-detail-edit.component.html',
  styleUrls: ['./logbook-detail-edit.component.scss'],
})
export class LogbookDetailEditComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [
    { label: 'Logbook', route: '/logbook' },
    { label: 'Crew List', route: '/logbook/crew-list' },
    { label: 'Logbook Detail List', route: '/logbook/logbook-detail' },
    { label: 'Edit Logbook' },
  ];
  editData!: IDetailedListContentData;
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
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.editData = history.state.data;
    console.log(this.editData);

    this.builder();
  }

  builder() {
    this.logbookFormGroup = this.formBuilder.group({
      crewName: [this.editData.crewName || '-'],
      companyId: [this.editData.companyId || '-'],
      updatedDate: [this.editData.updatedDate || '-'],
      aircraftType: [this.editData.aircraftType || '-'],
      aircraftReg: [this.editData.aircraftReg || '-'],
      status: [this.editData.status || '-'],
      flightVersion: ['-'], // TODO : Servise parametre eklendiğinde burada tanımlanmalıdır.
      date: [this.editData.date || ''],
      departure: [this.editData.departure || '-'],
      arrival: [this.editData.arrival || '-'],
      depTime: [this.editData.depTime || '-'],
      arrTime: [this.editData.arrTime || '-'],
      se: [this.editData.engineType === 'SE' ? 'X' : ''],
      me: [this.editData.engineType === 'ME' ? 'X' : ''],
      pic: [this.editData.pic || '-'],
      multiPilotTime: [this.editData.multiPilotTime || '-'],
      totalTime: [this.editData.totalTime || '-'],
      // Landing
      dayLanding: [this.editData.dayLanding || '-'],
      nightLanding: [this.editData.nightLanding || '-'],
      instructor: [this.editData.instructor || '-'],
      remarksAndEndorsements: [this.editData.remarksAndEndorsements || '-'],
      // Synthetic Training Devices Session
      syntheticTrainingDate: [this.editData.syntheticTrainingDate || '-'],
      syntheticTrainingType: [this.editData.syntheticTrainingType || '-'],
      syntheticTrainingTime: [this.editData.syntheticTrainingTime || '-'],
      // Pilot Function Time
      pilotFunctionPic: [this.editData.pilotFunctionPic || '-'],
      pilotFunctionCoPilot: [this.editData.pilotFunctionCoPilot || '-'],
      pilotFunctionDual: [this.editData.pilotFunctionDual || '-'],
      // Operation Condition Timek
      nightTime: [this.editData.nightTime || '-'],
      ifrTime: [this.editData.ifrTime || '-'],
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

  onSubmitRejectReason(): void {
    this.displayRejectPopup = false;

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
        this.showRejectToast();
        console.log('Rejected with reason:', this.rejectReason);
      },
      reject: () => {
        console.log('Rejection cancelled.');
      },
    });
  }

  showRejectToast() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Your rejection email has been sent.',
    });
  }
}
