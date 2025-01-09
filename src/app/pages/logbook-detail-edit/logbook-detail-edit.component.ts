import { Component, inject, OnInit, signal } from '@angular/core';
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
import { LogbookService } from '@shared/services/logbook.service';
import { ILogbookEditRequest } from '@shared/models/logbook-edit-request.model';
import { RadioButtonModule } from 'primeng/radiobutton';

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
    RadioButtonModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './logbook-detail-edit.component.html',
  styleUrls: ['./logbook-detail-edit.component.scss'],
})
export class LogbookDetailEditComponent implements OnInit {
  logbookService = inject(LogbookService);

  breadcrumbItems: MenuItem[] = [
    { label: 'Logbook', route: '/logbook' },
    { label: 'Crew List', route: '/logbook/crew-list' },
    { label: 'Logbook Detail List', route: '/logbook/logbook-detail' },
    { label: 'Edit Logbook' },
  ];
  editData!: IDetailedListContentData;
  logbookFormGroup!: FormGroup;
  selectedRow: any;
  rejectReason: string = '';
  displayRejectPopup: boolean = false;
  isEditMode = signal<boolean>(false);

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
      flightVersion: [null], // TODO : Servise parametre eklendiğinde burada tanımlanmalıdır.
      aircraftType: [this.editData.aircraftType],
      date: [this.editData.date || ''],
      aircraftReg: [this.editData.aircraftReg],
      departure: [this.editData.departure],
      arrival: [this.editData.arrival],
      depTime: [this.editData.depTime],
      arrTime: [this.editData.arrTime],
      engineType: [this.editData.engineType],
      pic: [this.editData.pic],
      multiPilotTime: [this.editData.multiPilotTime],
      totalTime: [this.editData.totalTime],
      // Landing
      dayLanding: [this.editData.dayLanding],
      nightLanding: [this.editData.nightLanding],
      instructor: [this.editData.instructor],
      remarksAndEndorsements: [this.editData.remarksAndEndorsements],
      // Synthetic Training Devices Session
      syntheticTrainingDate: [this.editData.syntheticTrainingDate],
      syntheticTrainingType: [this.editData.syntheticTrainingType],
      syntheticTrainingTime: [this.editData.syntheticTrainingTime],
      // Pilot Function Time
      pilotFunctionPic: [this.editData.pilotFunctionPic],
      pilotFunctionCoPilot: [this.editData.pilotFunctionCoPilot],
      pilotFunctionDual: [this.editData.pilotFunctionDual],
      // Operation Condition Timek
      nightTime: [this.editData.nightTime],
      ifrTime: [this.editData.ifrTime],
    });
    this.logbookFormGroup.disable();
  }

  onSave(): void {
    const message = this.editData.canReassign
      ? 'Do you want to reject the logbook document?'
      : 'Do you want to approve the logbook document?';
    this.confirmationService.confirm({
      message: `<div class="custom-confirm-content">
                  <div class="custom-confirm-icon">
                    <img src="/icons/approve-icon.svg" alt="Approve Icon" />
                  </div>
                  <p class="custom-confirm-message">${message}</p>
                </div>`,
      header: '',
      icon: '',
      closeOnEscape: false,
      acceptLabel: this.editData.canReassign ? 'Reject' : 'Approve',
      rejectLabel: 'Cancel',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'action-button',
      rejectButtonStyleClass: 'cancel-button',
      accept: () => {
        if (this.editData.canReassign) {
          this.displayRejectPopup = true;
        } else {
          this.formSubmit();
          this.toggleEditMode();
        }
      },
    });
  }

  formSubmit() {
    if (this.logbookFormGroup.valid) {
      const changesArr: ILogbookEditRequest['changes'] = [{}];
      const changedValues = this.checkFormChangeValues();

      if (Object.keys(changedValues).length > 0) {
        changesArr.shift();
        Object.keys(changedValues).map((item: string, index) => {
          changesArr.push({
            field: Object.keys(changedValues)[index]?.toString(),
            newValue: Object.values(changedValues)[index]?.toString(),
          });
        });
      }

      const requestBody: ILogbookEditRequest = {
        logId: this.editData.logId,
        changes: changesArr,
        ...(this.editData.canReassign && { uploadReason: this.rejectReason }),
      };

      this.logbookService.putEdit(requestBody).subscribe({
        next(response) {
          console.log(response);
        },
        error(err) {
          console.log(err);
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

  checkFormChangeValues() {
    const changedValues: any = {};
    for (const key in this.logbookFormGroup.value) {
      if (key in this.editData) {
        if (
          this.editData[key as keyof IDetailedListContentData] !=
          this.logbookFormGroup.value[key]
        ) {
          changedValues[key] = this.logbookFormGroup.value[key];
        }
      }
    }

    return changedValues;
  }

  toggleEditMode(): void {
    this.isEditMode.set(!this.isEditMode());

    if (this.isEditMode()) {
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
    this.formSubmit();
    this.toggleEditMode();
  }

  showRejectToast() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Your rejection email has been sent.',
    });
  }
}
