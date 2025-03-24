import { Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Column } from '@shared/models/columns';
import {
  IDetailedListContentData,
  IDetailedListResponse,
} from '@shared/models/detailed-list-response.model';
import { TruncateTextPipe } from '@shared/pipes/truncate-text.pipe';
import { PdfExportService } from '@shared/services/pdf-export.service';
import { AdminLogbookService } from '@shared/services/admin-logbook.service';
import { IDetailedListRequest } from '@shared/models/detailed-list-request.model';
import { ShowToastService } from '@shared/services/helpers-services/show-toast.service';
import { IGetCurrentMonthResponse } from '@shared/models/get-current-month-response.model';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { StateManagement } from '@shared/services/helpers-services/state-management.service';
import { ILogbookStatusListResponse } from '@shared/models/logbook-status-list-response.model';
import { DetailModalComponent } from '../../components/logbook-detail/detail-modal/detail-modal.component';
import { CustomBreadcrumbComponent } from '@shared/components/custom-breadcrumb/custom-breadcrumb.component';
import moment from 'moment';

import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileSaverService } from '@shared/services/helpers-services/file-saver.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-logbook',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomTableComponent,
    CustomBreadcrumbComponent,
    DetailModalComponent,
    TableModule,
    ConfirmDialogModule,
    DatePickerModule,
    SelectModule,
    DialogModule,
    InputTextModule,
    CheckboxModule,
    ToastModule,
    ButtonModule,
    TooltipModule,
    TruncateTextPipe,
  ],
  templateUrl: './logbook-detail.component.html',
  styleUrl: './logbook-detail.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class LogbookDetailComponent {
  constructor(private fileSaverService: FileSaverService) {}

  customTableComponent = viewChild.required(CustomTableComponent);
  dateColumnTemplate = viewChild.required('dateColumnTemplate');
  statusColumnTemplate = viewChild.required('statusColumnTemplate');
  commentColumnTemplate = viewChild.required('commentColumnTemplate');
  previewCellBodyTemplate = viewChild.required('previewCellBodyTemplate');
  editableCellBodyTemplate = viewChild.required('editableCellBodyTemplate');
  reviewedByColumnTemplate = viewChild.required('reviewedByColumnTemplate');
  updatedDateColumnTemplate = viewChild.required('updatedDateColumnTemplate');

  router = inject(Router);
  messageService = inject(MessageService);
  stateManagement = inject(StateManagement);
  showToastService = inject(ShowToastService);
  pdfExportService = inject(PdfExportService);
  adminLogbookService = inject(AdminLogbookService);
  confirmationService = inject(ConfirmationService);

  isLogbookCurrentMonth = signal<boolean>(false);
  crewListTableData = signal<any>(null);
  columns = signal<Column[]>([]);
  currentPage = signal<number>(0);
  currentRows = signal<number>(20);
  tableLoading = signal<boolean>(false);
  selectedCheckbox = signal<IDetailedListContentData[]>([]);
  logbookDetailData = signal<IDetailedListResponse | null>(null);
  logbookDetailTableData = signal<IDetailedListContentData[]>([]);
  getCurrentMonthData = signal<IGetCurrentMonthResponse | null>(null);
  startDate = signal<string>('');
  endDate = signal<string>('');
  statusFilter = signal<string>('');
  statusOptions = signal<ILogbookStatusListResponse[]>([]);
  maxCharCount = signal<number>(20);
  displayPreviewDialog = signal<boolean>(false);
  detailedListPreviewModalData = signal<IDetailedListContentData | null>(null);
  displayRejectPopup = false;
  rejectReason = '';
  breadcrumbItems = [
    { label: 'Logbook', routerLink: '/logbook' },
    { label: 'Crew List', routerLink: '/logbook/crew-list' },
    { label: 'Logbook Detail List' },
  ];

  ngOnInit() {
    this.isLogbookCurrentMonth.set(
      this.stateManagement.getState('isLogbookCurrentMonth'),
    );
    this.crewListTableData.set(this.stateManagement.getState('crewListPage'));

    this.defineColumn();

    this.startDate.set(this.dateRangeDefaultValue()[0].toString());
    this.endDate.set(this.dateRangeDefaultValue()[1].toString());

    if (this.isLogbookCurrentMonth()) {
      this.getDetailedListForCurrentMonth(this.crewListTableData().companyId);
    } else {
      this.getDetailedList();
      this.getLogbookStatusList();
    }
  }

  defineColumn() {
    this.columns.set([
      { field: 'date', header: 'Date', template: this.dateColumnTemplate() },
      { field: 'dutyType', header: 'Duty Type' },
      { field: 'aircraftType', header: 'A/C Type' },
      { field: 'aircraftReg', header: 'A/C Reg' },
      { field: 'departure', header: 'Departure' },
      { field: 'departureTime', header: 'Departure Time' },
      { field: 'arrival', header: 'Arrival' },
      { field: 'arrivalTime', header: 'Arrival Time' },
      { field: 'totalTime', header: 'Total Time' },
      { field: 'multiPilotTime', header: 'Multi Pilot Time' },
      {
        field: 'updatedDate',
        header: 'Update Date',
        template: this.updatedDateColumnTemplate(),
      },
      {
        field: 'uploadReason',
        header: 'Comment',
        template: this.commentColumnTemplate(),
      },
      {
        field: 'lastReviewedAdmin',
        header: 'Reviewed By',
        template: this.reviewedByColumnTemplate(),
      },
      {
        field: 'status',
        header: 'Status',
        template: this.statusColumnTemplate(),
      },
      ...(!this.isLogbookCurrentMonth()
        ? [{ field: '', header: '', template: this.previewCellBodyTemplate() }]
        : []),
      ...(!this.isLogbookCurrentMonth()
        ? [{ field: '', header: '', template: this.editableCellBodyTemplate() }]
        : []),
    ]);
  }

  // API Calls Operations
  getLogbookStatusList() {
    this.adminLogbookService.getLogbookStatusList().subscribe({
      next: (response) => {
        this.statusOptions.set(response);
      },
    });
  }

  getDetailedList() {
    this.tableLoading.set(true);

    const requestBody: IDetailedListRequest = {
      monthLogId: this.crewListTableData()?.monthlyLogbookId,
      status: this.statusFilter(),
      startDate: this.startDate(),
      endDate: this.endDate(),
    };

    this.adminLogbookService
      .getDetailedList(requestBody, this.currentPage(), this.currentRows())
      .subscribe({
        next: (response) => {
          this.logbookDetailData.set(response);
          this.logbookDetailTableData.set(response.logbookDetails.content);
          this.selectedCheckbox.set([]);
          this.customTableComponent().clearSelectionData();
          this.tableLoading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.tableLoading.set(false);
        },
      });
  }

  getDetailedListForCurrentMonth(companyId: number) {
    this.tableLoading.set(true);
    this.adminLogbookService.getCurrentMonth(companyId).subscribe({
      next: (response) => {
        this.getCurrentMonthData.set(response);
        this.tableLoading.set(false);
      },
      error: () => {
        this.tableLoading.set(false);
      },
    });
  }

  putApprove() {
    const logIds = this.selectedCheckbox().map((item) => item.logId);

    this.adminLogbookService.putApprove(logIds).subscribe({
      next: () => {
        this.getDetailedList();
        this.showToastService.showSuccessToast(
          'Logbook(s) approved successfully.',
        );
      },
    });
  }

  putReject() {
    const logId = this.selectedCheckbox().map((item) => item.logId)[0];

    this.adminLogbookService.putReject(logId, this.rejectReason).subscribe({
      next: () => {
        this.getDetailedList();
        this.rejectReason = '';
        this.showToastService.showSuccessToast(
          'Logbook rejected successfully.',
        );
      },
    });
  }

  // Filter Operations
  dateRangeDefaultValue() {
    this.crewListTableData().yearMonth;
    let year = new Date(this.crewListTableData().yearMonth).getFullYear();
    let month = new Date(this.crewListTableData().yearMonth).getMonth();
    let startDate = moment(new Date(year, month, 1)).format();
    let endDate = moment(new Date(year, month + 1, 1)).format();

    return [startDate, endDate];
  }

  // Approve and Reject Operations
  selectionCheckbox(event: any) {
    this.selectedCheckbox.set(event);
  }

  onApprove(): void {
    this.confirmationService.confirm({
      message: `<div class="custom-confirm-content">
                  <div class="custom-confirm-icon">
                    <img src="/icon/approve-icon.svg" alt="Approve Icon" />
                  </div>
                  <p class="custom-confirm-message">Do you want to approve the logbook(s) document?</p>
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
        this.putApprove();
      },
    });
  }

  onSubmitRejectReason(): void {
    this.displayRejectPopup = false;

    this.confirmationService.confirm({
      message: `<div class="custom-confirm-content">
                  <div class="custom-confirm-icon">
                    <img src="/icon/reject_icon.svg" alt="Reject Icon" />
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
        this.putReject();
      },
    });
  }

  // Other Operations
  goToLogBookDetailEditPage(data: IDetailedListContentData) {
    this.stateManagement.setState('logbookDetailPage', { logId: data.logId });
    this.router.navigate(['logbook/logbook-detail-edit']);
  }

  togglePreviewDialog(rowData?: IDetailedListContentData) {
    this.displayPreviewDialog.set(!this.displayPreviewDialog());
    this.detailedListPreviewModalData.set(rowData ? rowData : null);
  }

  onPageChange(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage.set(page);
    this.currentRows.set(event.rows);

    if (!this.isLogbookCurrentMonth()) {
      this.getDetailedList();
    }
  }

  async pdfExport() {
    const companyId = this.crewListTableData().companyId;
    const yearMonth = this.crewListTableData().yearMonth;

    try {
      const res = await firstValueFrom(
        this.pdfExportService.getPdfExport(companyId, yearMonth),
      );
      this.fileSaverService.getFileSaver(
        res,
        `Logbook_${companyId}_${yearMonth}.pdf`,
      );
    } catch (error) {
      console.error('PDF Download Error:', error);
    }
  }

  async pdfExportForCurrentMonth() {
    const companyId = this.crewListTableData().companyId;
    try {
      const res = await firstValueFrom(
        this.adminLogbookService.pdfExportCurrentMonth(
          companyId,
          this.crewListTableData().fullName,
          this.getCurrentMonthData(),
        ),
      );
      this.fileSaverService.getFileSaver(res, `Logbook_${companyId}.pdf`);
    } catch (error) {
      console.error('PDF Download Error:', error);
    }
  }
}
