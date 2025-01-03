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
import { ButtonModule } from 'primeng/button';
import moment from 'moment';

@Component({
  selector: 'app-logbook',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomTableComponent,
    CustomBreadcrumbComponent,
    DetailModalComponent,
    TableModule,
    ConfirmDialogModule,
    CalendarModule,
    DropdownModule,
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
  formBuilder = inject(FormBuilder);

  breadcrumbItems = [
    { label: 'Logbook', route: '/logbook' },
    { label: 'Crew List', route: '/logbook/crew-list' },
    { label: 'Logbook Detail List' },
  ];
  filterFormGroup!: FormGroup;
  minDate = new Date();
  maxDate = new Date();
  columns: Column[] = [];
  crewListTableData!: ILogbookCrewListContentData;
  logbookDetailData = signal<IDetailedListResponse | null>(null);
  logbookDetailTableData = signal<IDetailedListContentData[]>([]);
  detailedListPreviewModalData = signal<IDetailedListContentData | null>(null);
  currentPage = 0;
  currentRows = 20;
  tableLoading = false;
  displayRejectPopup = false;
  rejectReason = '';
  selectedCheckbox: any[] = [];
  displayPreviewDialog = signal<boolean>(false);

  // Mock Data
  statusOptions = [
    { label: 'APPROVED', value: 'APPROVED' },
    { label: 'REASSIGNED', value: 'REASSIGNED' },
    { label: 'WAITING_APPROVAL', value: 'WAITING_APPROVAL' },
    { label: 'REJECTED', value: 'REJECTED' },
  ];

  ngOnInit() {
    this.crewListTableData = history.state.data;

    this.builder();
    this.defineColumn();
    this.getDetailedList();

    this.setCalendarMinMaxDate();
  }

  builder() {
    this.filterFormGroup = this.formBuilder.group({
      status: [''],
      dateRange: [this.dateRangeDefaultValue()],
    });
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
    this.tableLoading = true;
    const status = this.filterFormGroup.get('status')?.value;
    let formattedStartDate = '';
    let formattedEndDate = '';
    if (this.filterFormGroup.get('dateRange')?.value) {
      const startDate = this.filterFormGroup.get('dateRange')?.value[0];
      const endDate = this.filterFormGroup.get('dateRange')?.value[1];

      formattedStartDate = startDate ? moment(startDate).format() : '';

      formattedEndDate = endDate ? moment(endDate).format() : '';
    }

    const requestBody: IDetailedListRequest = {
      monthLogId: this.crewListTableData.monthlyLogbookId,
      status: status,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    this.logbookService
      .getDetailedList(requestBody, this.currentPage, this.currentRows)
      .subscribe({
        next: (response) => {
          this.logbookDetailData.set(response);
          this.logbookDetailTableData.set(response.content);
          this.tableLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.tableLoading = false;
        },
      });
  }

  // Filter Operations
  dateRangeDefaultValue() {
    this.crewListTableData.yearMonth;
    let year = new Date(this.crewListTableData.yearMonth).getFullYear();
    let month = new Date(this.crewListTableData.yearMonth).getMonth();
    let startDate = new Date(year, month, 1);
    let endDate = new Date(year, month, 2);

    return [startDate, endDate];
  }

  setCalendarMinMaxDate() {
    let defaultDate = new Date(this.crewListTableData.yearMonth)
    this.minDate = new Date(defaultDate.getFullYear(), defaultDate.getMonth() , 1);
    this.maxDate = new Date(defaultDate.getFullYear(), defaultDate.getMonth() + 1 , 0);
  }

  onFilterSubmit() {
    this.getDetailedList();
  }

  // Approve and Reject Operations
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

  // Other Operations
  dateTitleTemplate() {
    let dateFormat = "";

    if(this.crewListTableData.yearMonth) {
      dateFormat = moment(this.crewListTableData.yearMonth).format('MMMM YYYY');
    }

    return dateFormat;
  }

  goToLogBookDetailEditPage(data: any) {
    this.router.navigate(['logbook/logbook-detail-edit'], {
      state: { data: data },
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
