import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
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
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-logbook-edit',
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
    TooltipModule,
    DatePickerModule,
    InputMaskModule,
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
    { label: 'Logbook' },
    { label: 'Crew List' },
    { label: 'Logbook Detail List' },
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
      departureTime: [
        this.editDefaultData()?.departureTime,
        [this.timeFieldControl],
      ],
      arrivalTime: [
        this.editDefaultData()?.arrivalTime,
        [this.timeFieldControl],
      ],
      engineType: [this.editDefaultData()?.engineType],
      pic: [this.editDefaultData()?.pic],
      multiPilotTime: [
        this.editDefaultData()?.multiPilotTime,
        [this.timeFieldControl],
      ],
      totalTime: [this.editDefaultData()?.totalTime, [this.timeFieldControl]],
      instructor: [this.editDefaultData()?.instructor],
      // Synthetic Training Devices Session
      syntheticTrainingDate: [this.editDefaultData()?.syntheticTrainingDate],
      syntheticTrainingType: [this.editDefaultData()?.syntheticTrainingType],
      syntheticTrainingTime: [
        this.editDefaultData()?.syntheticTrainingTime,
        [this.timeFieldControl],
      ],
      // Pilot Function Time
      pilotFunctionPic: [
        this.editDefaultData()?.pilotFunctionPic,
        [this.timeFieldControl],
      ],
      pilotFunctionCoPilot: [
        this.editDefaultData()?.pilotFunctionCoPilot,
        [this.timeFieldControl],
      ],
      pilotFunctionDual: [
        this.editDefaultData()?.pilotFunctionDual,
        [this.timeFieldControl],
      ],
      // Operation Condition Timek
      night: [this.editDefaultData()?.night, [this.timeFieldControl]],
      ifr: [this.editDefaultData()?.ifr, [this.timeFieldControl]],
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
        uploadReason: this.rejectReason,
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
    const message = this.editDefaultData()?.isFinalReassign
      ? 'Do you want to approve the logbook document?'
      : 'Do you want to reject the logbook document?';
    this.confirmationService.confirm({
      message: `<div class="custom-confirm-content">
                  <div class="custom-confirm-icon">
                    <img src="/icon/approve-icon.svg" alt="Approve Icon" />
                  </div>
                  <p class="custom-confirm-message">${message}</p>
                </div>`,
      header: '',
      icon: '',
      closeOnEscape: false,
      acceptLabel: this.editDefaultData()?.isFinalReassign
        ? 'Approve'
        : 'Reject',
      rejectLabel: 'Cancel',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'action-button',
      rejectButtonStyleClass: 'cancel-button',
      accept: () => {
          this.displayRejectPopup = true;
      },
    });
  }

  onCancel(): void {
    this.toggleEditMode();
    this.builder();
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

  generateHistoryTooltip(data: any): string {
    const changerForUser: any[] = [];
    const changerForAdmin: any[] = [];
    const changerForOriginal: any[] = [];

    data?.map((item: any) => {
      if (item.changerType === 'USER') {
        changerForUser.push(item.value);
      } else if (item.changerType === 'ADMIN') {
        changerForAdmin.push(item.value);
      } else if (item.changerType === 'ORIGINAL') {
        changerForOriginal.push(item.value);
      }
    });

    // API den versiyon sırası ilk eleman en güncel olan olduğu için diziyi tersine çeviriyoruz.
    changerForUser.reverse();
    changerForAdmin.reverse();
    changerForOriginal.reverse();

    return `<div class="flex gap-5">
              <div>
                <p class="mb-5"></p>
                <p class="font-semibold">User</p>
                <p class="font-semibold">Admin</p>
              </div>

              <div>
                <p class="font-semibold">Actual</p>
                <p>${changerForOriginal[0] || '-'}</p>
                <p>-</p>
              </div>

              <div>
                <p class="font-semibold">V1</p>
                <p>${changerForUser[0] || '-'}</p>
                <p>${changerForAdmin[0] || '-'}</p>
              </div>

              <div>
                <p class="font-semibold">V2</p>
                <p>${changerForUser[1] || '-'}</p>
                <p>${changerForAdmin[1] || '-'}</p>
              </div>

              <div>
                <p class="font-semibold">V3</p>
                <p>${changerForUser[2] || '-'}</p>
                <p>${changerForAdmin[2] || '-'}</p>
              </div>
              
            </div>`;
  }

  checkCahngedField(fieldName: string): boolean {
    const changesField = this.editDefaultData()?.changes;
    if (changesField) {
      return Object.keys(changesField).includes(fieldName);
    }
    return false;
  }

  convertBase64ToImage(): string {
    let signatureBase64 = this.editDefaultData()?.signature;

    if (signatureBase64) {
      return `data:image/jpeg;base64,${signatureBase64}`;
    }

    return '';
  }

  timeFieldControl(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;

    if (!value || value.length !== 5) {
      return null;
    }

    const [hours, minutes] = value.split(':').map(Number);

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return { invalidTime: true };
    }

    return null;
  }

  onInputUpperCase(event: Event, formControlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const uppercaseValue = inputElement.value.toUpperCase();
    this.logbookFormGroup.get(formControlName)?.setValue(uppercaseValue, { emitEvent: false });
  }
}
