import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  IDetailedListContentData,
  IDetailedListResponse,
} from '@shared/models/detailed-list-response.model';
import { CustomBreadcrumbComponent } from '@shared/components/custom-breadcrumb/custom-breadcrumb.component';
import { DetailModalComponent } from '../../components/logbook-detail/detail-modal/detail-modal.component';
import { ILogbookStatusListResponse } from '@shared/models/logbook-status-list-response.model';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { ILogbookCrewListContentData } from '@shared/models/logbook-crew-list-response.model';
import { ShowToastService } from '@shared/services/helpers-services/show-toast.service';
import { IDetailedListRequest } from '@shared/models/detailed-list-request.model';
import { LogbookService } from '@shared/services/logbook.service';
import { Column } from '@shared/models/columns';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import moment from 'moment';

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
  ],
  templateUrl: './logbook-detail.component.html',
  styleUrl: './logbook-detail.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class LogbookDetailComponent {
  @ViewChild(CustomTableComponent) customTableComponent!: CustomTableComponent;
  @ViewChild('dateColumnTemplate', { static: true })
  dateColumnTemplate!: TemplateRef<any>;
  @ViewChild('updatedDateColumnTemplate', { static: true })
  updatedDateColumnTemplate!: TemplateRef<any>;
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
  showToastService = inject(ShowToastService);

  breadcrumbItems = [
    { label: 'Logbook' },
    { label: 'Crew List' },
    { label: 'Logbook Detail List' },
  ];
  columns: Column[] = [];
  crewListTableData!: ILogbookCrewListContentData;
  currentPage = 0;
  currentRows = 20;
  tableLoading = false;
  displayRejectPopup = false;
  rejectReason = '';
  logbookDetailData = signal<IDetailedListResponse | null>(null);
  logbookDetailTableData = signal<IDetailedListContentData[]>([]);
  detailedListPreviewModalData = signal<IDetailedListContentData | null>(null);
  statusOptions = signal<ILogbookStatusListResponse[]>([]);
  selectedCheckbox = signal<IDetailedListContentData[]>([]);
  displayPreviewDialog = signal<boolean>(false);
  startDate = signal<string>('');
  endDate = signal<string>('');
  statusFilter = '';

  ngOnInit() {
    this.crewListTableData = history.state.data;
    this.startDate.set(this.dateRangeDefaultValue()[0].toString());
    this.endDate.set(this.dateRangeDefaultValue()[1].toString());

    this.defineColumn();
    this.getDetailedList();
    this.getLogbookStatusList();
  }

  defineColumn() {
    this.columns = [
      { field: 'date', header: 'Date', template: this.dateColumnTemplate },
      { field: 'dutyType', header: 'Duty Type' },
      { field: 'aircraftType', header: 'A/C Type' },
      { field: 'aircraftReg', header: 'A/C Reg' },
      { field: 'departure', header: 'Departure' },
      { field: 'depTime', header: 'Departure Time' },
      { field: 'arrival', header: 'Arrival' },
      { field: 'arrTime', header: 'Arrival Time' },
      { field: 'totalTime', header: 'Total Time' },
      { field: 'multiPilotTime', header: 'Multi Pilot Time' },
      {
        field: 'updatedDate',
        header: 'Update Date',
        template: this.updatedDateColumnTemplate,
      },
      { field: 'uploadReason', header: 'Comment' },
      { field: 'lastReviewedAdmin', header: 'Reviewed By' },
      { field: 'status', header: 'Status' },
      { field: '', header: '', template: this.previewCellBodyTemplate },
      { field: '', header: '', template: this.editableCellBodyTemplate },
    ];
  }

  // API Calls Operations
  getDetailedList() {
    this.tableLoading = true;

    const requestBody: IDetailedListRequest = {
      monthLogId: this.crewListTableData.monthlyLogbookId,
      logbookType: this.crewListTableData.logbookType,
      status: this.statusFilter,
      startDate: this.startDate(),
      endDate: this.endDate(),
    };

    this.logbookService
      .getDetailedList(requestBody, this.currentPage, this.currentRows)
      .subscribe({
        next: (response) => {
          this.logbookDetailData.set(response);
          this.logbookDetailTableData.set(response.logbookDetails.content);
          this.selectedCheckbox.set([]);
          this.customTableComponent.clearSelectionData();
          this.tableLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.tableLoading = false;
        },
      });
  }

  getLogbookStatusList() {
    this.logbookService.getLogbookStatusList().subscribe({
      next: (response) => {
        this.statusOptions.set(response);
      },
    });
  }

  putApprove() {
    const logIds = this.selectedCheckbox().map((item) => item.logId);

    this.logbookService.putApprove(logIds).subscribe({
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

    this.logbookService.putReject(logId, this.rejectReason).subscribe({
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
    this.crewListTableData.yearMonth;
    let year = new Date(this.crewListTableData.yearMonth).getFullYear();
    let month = new Date(this.crewListTableData.yearMonth).getMonth();
    let startDate = moment(new Date(year, month, 1)).format();
    let endDate = moment(new Date(year, month + 1, 0)).format();

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
                    <img src="/icons/approve-icon.svg" alt="Approve Icon" />
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
        this.putReject();
      },
    });
  }

  // Other Operations
  goToLogBookDetailEditPage(data: IDetailedListContentData) {
    this.router.navigate(['logbook/logbook-detail-edit'], {
      state: { logId: data.logId },
    });
  }

  togglePreviewDialog(rowData?: IDetailedListContentData) {
    this.displayPreviewDialog.set(!this.displayPreviewDialog());
    this.detailedListPreviewModalData.set(rowData ? rowData : null);
  }

  onPageChange(event: { first: number; rows: number }) {
    const page = event.first / event.rows;
    this.currentPage = page;
    this.currentRows = event.rows;
    this.getDetailedList();
  }
}
