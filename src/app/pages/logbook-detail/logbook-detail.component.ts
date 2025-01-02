import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IDetailedListContentData,
  IDetailedListResponse,
} from '@shared/models/detailed-list-response.model';
import { CustomBreadcrumbComponent } from '@shared/components/custom-breadcrumb/custom-breadcrumb.component';
import { DetailModalComponent } from '../../components/logbook-detail/detail-modal/detail-modal.component';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { ILogbookCrewListContentData } from '@shared/models/logbook-crew-list-response.model';
import { IDetailedListRequest } from '@shared/models/detailed-list-request.model';
import { LogbookService } from '@shared/services/logbook.service';
import { Column } from '@shared/models/columns';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmationService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-logbook',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ConfirmDialogModule,
    CalendarModule,
    DropdownModule,
    DialogModule,
    CustomTableComponent,
    InputTextModule,
    CustomBreadcrumbComponent,
    CheckboxModule,
    ToastModule,
    DetailModalComponent,
  ],
  templateUrl: './logbook-detail.component.html',
  styleUrl: './logbook-detail.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class LogbookDetailComponent {
  @ViewChild('previewCellBodyTemplate', { static: true })
  previewCellBodyTemplate!: TemplateRef<any>;
  @ViewChild('editableCellBodyTemplate', { static: true })
  editableCellBodyTemplate!: TemplateRef<any>;
  @ViewChild('checkboxCellBodyTemplate', { static: true })
  checkboxCellBodyTemplate!: TemplateRef<any>;

  router = inject(Router);
  logbookService = inject(LogbookService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  breadcrumbItems = [
    { label: 'Logbook', route: '/logbook' },
    { label: 'Crew List', route: '/logbook/crew-list' },
    { label: 'Logbook Detail List' },
  ];
  columns: Column[] = [];
  crewListTableData!: ILogbookCrewListContentData;
  logbookDetailData = signal<IDetailedListResponse | null>(null);
  logbookDetailTableData = signal<IDetailedListContentData[]>([]);
  currentPage = 0;
  currentRows = 20;
  dateRange: Date[] = [];
  selectedDutyType = '';
  selectedPeriod = '';
  displayRejectPopup = false;
  rejectReason = '';
  selectedCheckbox: any[] = [];
  displayPreviewDialog = false;

  // Mock Data
  statusOptions = [
    { label: 'Status 1', value: 'status' },
    { label: 'Status 2', value: 'status' },
    { label: 'Status 3', value: 'status' },
  ];
  dutyTypeOptions = [
    { label: 'Duty Type 1', value: 'dutyType1' },
    { label: 'Duty Type 2', value: 'dutyType2' },
    { label: 'Duty Type 3', value: 'dutyType3' },
  ];

  ngOnInit() {
    this.defineColumn();

    this.crewListTableData = history.state.data;
    console.log(this.crewListTableData);

    this.getDetailedList();
  }

  defineColumn() {
    this.columns = [
      { field: 'date', header: 'Date' },
      { field: 'dutyType', header: 'Duty Type' },
      { field: 'aircraftType', header: 'A/C Type' },
      { field: 'aircraftReg', header: 'A/C Reg' },
      { field: 'departure', header: 'Departure' },
      { field: 'depTime', header: 'Departure Time' },
      { field: 'arrival', header: 'Arrival' },
      { field: 'arrTime', header: 'Arrival Time' },
      { field: 'totalTime', header: 'Total Time' },
      { field: 'updateDate', header: 'Update Date' },
      { field: 'comment', header: 'Comment' },
      { field: 'reviewedBy', header: 'Reviewed By' },
      { field: 'status', header: 'Status' },
      { field: '', header: '', template: this.previewCellBodyTemplate },
      { field: '', header: '', template: this.editableCellBodyTemplate },
    ];
  }

  getDetailedList() {
    // TODO: Filtreler request'e eklenmeli.
    const requestBody: IDetailedListRequest = {
      monthLogId: this.crewListTableData.monthlyLogbookId,
      status: '',
      startDate: '',
      endDate: '',
    };

    this.logbookService
      .getDetailedList(requestBody, this.currentPage, this.currentRows)
      .subscribe({
        next: (response) => {
          this.logbookDetailData.set(response);
          this.logbookDetailTableData.set(response.content);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  selectionCheckbox(event: any) {
    this.selectedCheckbox = event;
    console.log(this.selectedCheckbox);
  }

  onApprove(): void {
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
        console.log('Approved:', this.selectedCheckbox);
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

  goToLogBookDetailEditPage(data: any) {
    this.router.navigate(['logbook/logbook-detail-edit'], {
      state: { data: data },
    });
  }

  toggleModal() {
    this.displayPreviewDialog = !this.displayPreviewDialog;
  }

  onPageChange(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getDetailedList();
  }
}
