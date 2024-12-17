import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { CustomBreadcrumbComponent } from '@shared/components/custom-breadcrumb/custom-breadcrumb.component';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
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

  crewListTableData: any;
  dateRange: Date[] = [];
  selectedDutyType = '';
  selectedPeriod = '';
  displayRejectPopup = false;
  rejectReason = '';
  selectedCheckbox: any[] = [];

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

  breadcrumbItems = [
    { label: 'Logbook', route: '/logbook' },
    { label: 'Crew List', route: '/crew-list' },
    { label: 'Logbook Detail List' },
  ];

  columns: Column[] = [];
  logbookDetailData = [
    {
      id: 0,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: '-',
      reviewedBy: 'ADMIN',
      status: 'APPROVED',
    },
    {
      id: 1,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: '-',
      status: 'PENDING',
      checked: false,
    },
    {
      id: 2,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: '-',
      reviewedBy: 'ADMIN',
      status: 'APPROVED',
      checked: false,
    },
    {
      id: 3,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN',
      status: 'PENDING',
      checked: false,
    },
    {
      id: 4,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: '-',
      reviewedBy: '-',
      status: 'APPROVED',
      checked: false,
    },
    {
      id: 5,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN',
      status: 'PENDING',
      checked: false,
    },
    {
      id: 6,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: '-',
      status: 'APPROVED',
      checked: false,
    },
    {
      id: 7,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: '-',
      reviewedBy: 'ADMIN',
      status: 'PENDING',
      checked: false,
    },
    {
      id: 8,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: '-',
      status: 'APPROVED',
      checked: false,
    },
    {
      id: 9,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN',
      status: 'PENDING',
      checked: false,
    },
    {
      id: 10,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: '-',
      status: 'APPROVED',
      checked: false,
    },
    {
      id: 11,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: '-',
      reviewedBy: 'ADMIN',
      status: 'PENDING',
      checked: false,
    },
    {
      id: 12,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: '-',
      status: 'APPROVED',
      checked: false,
    },
    {
      id: 13,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: '-',
      reviewedBy: 'ADMIN',
      status: 'PENDING',
      checked: false,
    },
    {
      id: 14,
      date: '23/12/2024',
      dutyType: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '20:35',
      arrival: 'ADB',
      arrTime: '21:45',
      totalTime: '01:10',
      updateDate: '23/12/2024 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: '-',
      status: 'APPROVED',
      checked: false,
    },
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.defineColumn();

    this.crewListTableData = history.state.data;
    console.log(this.crewListTableData);
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
}
