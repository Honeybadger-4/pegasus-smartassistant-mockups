import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CustomBreadcrumbComponent } from '@shared/components/custom-breadcrumb/custom-breadcrumb.component';
import { IDetailedListContentData } from '@shared/models/detailed-list-response.model';
import { LogbookService } from '@shared/services/logbook.service';
import { ILogbookEditRequest } from '@shared/models/logbook-edit-request.model';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-logbook-edit',
  standalone: true,
  imports: [
    CommonModule,
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
    ProgressSpinnerModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './logbook-detail-edit.component.html',
  styleUrls: ['./logbook-detail-edit.component.scss'],
})
export class LogbookDetailEditComponent implements OnInit {
  logbookService = inject(LogbookService);
  formBuilder = inject(FormBuilder);
  confirmationService = inject(ConfirmationService);

  breadcrumbItems: MenuItem[] = [
    { label: 'Logbook', route: '/logbook' },
    { label: 'Crew List', route: '/logbook/crew-list' },
    { label: 'Logbook Detail List', route: '/logbook/logbook-detail' },
    { label: 'Edit Logbook' },
  ];
  logId: number = 0;
  logbookFormGroup!: FormGroup;
  rejectReason: string = '';
  displayRejectPopup: boolean = false;
  editDefaultData = signal<IDetailedListContentData | null>(null);
  formDataLoading = signal<boolean>(false);
  isEditMode = signal<boolean>(false);

  ngOnInit() {
    this.logId = history.state.logId;

    this.getLogByLogId();
    this.builder();
  }

  builder() {
    this.logbookFormGroup = this.formBuilder.group({
      dutyType: [this.editDefaultData()?.dutyType],
      aircraftType: [this.editDefaultData()?.aircraftType],
      date: [this.editDefaultData()?.date || ''],
      aircraftReg: [this.editDefaultData()?.aircraftReg],
      departure: [this.editDefaultData()?.departure],
      arrival: [this.editDefaultData()?.arrival],
      depTime: [this.editDefaultData()?.depTime],
      arrTime: [this.editDefaultData()?.arrTime],
      engineType: [this.editDefaultData()?.engineType],
      pic: [this.editDefaultData()?.pic],
      multiPilotTime: [this.editDefaultData()?.multiPilotTime],
      totalTime: [this.editDefaultData()?.totalTime],
      // Landing
      dayLanding: [this.editDefaultData()?.dayLanding],
      nightLanding: [this.editDefaultData()?.nightLanding],
      instructor: [this.editDefaultData()?.instructor],
      remarksAndEndorsements: [this.editDefaultData()?.remarksAndEndorsements],
      // Synthetic Training Devices Session
      syntheticTrainingDate: [this.editDefaultData()?.syntheticTrainingDate],
      syntheticTrainingType: [this.editDefaultData()?.syntheticTrainingType],
      syntheticTrainingTime: [this.editDefaultData()?.syntheticTrainingTime],
      // Pilot Function Time
      pilotFunctionPic: [this.editDefaultData()?.pilotFunctionPic],
      pilotFunctionCoPilot: [this.editDefaultData()?.pilotFunctionCoPilot],
      pilotFunctionDual: [this.editDefaultData()?.pilotFunctionDual],
      // Operation Condition Timek
      nightTime: [this.editDefaultData()?.nightTime],
      ifrTime: [this.editDefaultData()?.ifrTime],
    });

    this.logbookFormGroup.disable();
  }

  getLogByLogId() {
    this.formDataLoading.set(true);

    this.logbookService.getLogByLogId(this.logId).subscribe({
      next: (response) => {
        this.editDefaultData.set(response);
        this.formDataLoading.set(false);
        this.builder();
      },
      error: (error) => {
        this.formDataLoading.set(false);
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
        logId: this.editDefaultData()?.logId || 0,
        changes: changesArr,
        ...(this.editDefaultData()?.canReassign && {
          uploadReason: this.rejectReason,
        }),
      };

      this.logbookService.putEdit(requestBody).subscribe({
        next: () => {
          this.getLogByLogId();
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

  checkFormChangeValues() {
    const changedValues: any = {};
    const defaultData = this.editDefaultData();

    for (const key in this.logbookFormGroup.value) {
      if (defaultData && key in defaultData) {
        if (
          defaultData[key as keyof IDetailedListContentData] !=
          this.logbookFormGroup.value[key]
        ) {
          changedValues[key] = this.logbookFormGroup.value[key];
        }
      }
    }

    return changedValues;
  }

  onSave(): void {
    const message = this.editDefaultData()?.canReassign
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
      acceptLabel: this.editDefaultData()?.canReassign ? 'Reject' : 'Approve',
      rejectLabel: 'Cancel',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'action-button',
      rejectButtonStyleClass: 'cancel-button',
      accept: () => {
        if (this.editDefaultData()?.canReassign) {
          this.displayRejectPopup = true;
        } else {
          this.formSubmit();
          this.toggleEditMode();
        }
      },
    });
  }

  onSubmitRejectReason(): void {
    this.formSubmit();
    this.toggleEditMode();
    this.displayRejectPopup = false;
  }

  toggleEditMode(): void {
    this.isEditMode.set(!this.isEditMode());

    if (this.isEditMode()) {
      this.logbookFormGroup.enable();
    } else {
      this.logbookFormGroup.disable();
    }
  }

  rejectReasonDialogOnHide() {
    this.rejectReason = '';
  }
}
