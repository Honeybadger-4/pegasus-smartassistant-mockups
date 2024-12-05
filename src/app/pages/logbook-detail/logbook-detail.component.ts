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
  ],
  templateUrl: './logbook-detail.component.html',
  styleUrl: './logbook-detail.component.scss',
  providers: [ConfirmationService],
})
export class LogbookDetailComponent {
  @ViewChild('previewCellBodyTemplate', { static: true })
  previewCellBodyTemplate!: TemplateRef<any>;
  @ViewChild('editableCellBodyTemplate', { static: true })
  editableCellBodyTemplate!: TemplateRef<any>;

  dateRange: Date[] = [];
  selectedPeriod = '';
  searchQuery = '';
  displayRejectPopup = false;
  rejectReason = '';
  selectedRow: any = null;

  statusOptions = [
    { label: 'Status 1', value: 'status' },
    { label: 'Status 2', value: 'status' },
    { label: 'Status 3', value: 'status' },
  ];

  columns: Column[] = [];
  logbookDetailData = [
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      date: '22/07/2025 13:30',
      flightVersion: 'Flight',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '05:05',
      arrival: 'ADB',
      arrTime:'06:14',
      totalTime: '06:14',
      updateDate: '-',
      comment: '-',
      reviewedBy: '-',
      status: 'APPROVED',
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      date: '22/07/2025 13:30',
      flightVersion: 'Flight',

      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '05:05',
      arrival: 'ADB',
      arrTime:'06:14',
      totalTime: '06:14',


      updateDate: '30/07/2025 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN',
      status: 'PENDING',
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      date: '22/07/2025 13:30',
      flightVersion: 'Flight',

      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '05:05',
      arrival: 'ADB',
      arrTime:'06:14',
      totalTime: '06:14',


      updateDate: '30/07/2025 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN',
      status: 'REASSING',
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      date: '22/07/2025 13:30',
      flightVersion: 'B737',

      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '05:05',
      arrival: 'ADB',
      arrTime:'06:14',
      totalTime: '06:14',


      updateDate: '-',
      comment: '-',
      reviewedBy: '-',
      status: 'APPROVED',
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      date: '22/07/2025 13:30',
      flightVersion: 'Flight',

      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '05:05',
      arrival: 'ADB',
      arrTime:'06:14',
      totalTime: '06:14',


      updateDate: '30/07/2025 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN',
      status: 'PENDING',
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      date: '22/07/2025 13:30',
      flightVersion: 'Flight',

      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '05:05',
      arrival: 'ADB',
      arrTime:'06:14',
      totalTime: '06:14',


      updateDate: '30/07/2025 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN',
      status: 'REASSING',
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      date: '22/07/2025 13:30',
      flightVersion: 'Flight',

      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '05:05',
      arrival: 'ADB',
      arrTime:'06:14',
      totalTime: '06:14',


      updateDate: '-',
      comment: '-',
      reviewedBy: '-',
      status: 'APPROVED',
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      date: '22/07/2025 13:30',
      flightVersion: 'Flight',

      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '05:05',
      arrival: 'ADB',
      arrTime:'06:14',
      totalTime: '06:14',


      updateDate: '-',
      comment: '-',
      reviewedBy: '-',
      status: 'APPROVED',
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      date: '22/07/2025 13:30',
      flightVersion: 'Flight',

      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '05:05',
      arrival: 'ADB',
      arrTime:'06:14',
      totalTime: '06:14',


      updateDate: '30/07/2025 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN',
      status: 'PENDING',
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      date: '22/07/2025 13:30',
      flightVersion: 'Flight',

      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '05:05',
      arrival: 'ADB',
      arrTime:'06:14',
      totalTime: '06:14',


      updateDate: '-',
      comment: '-',
      reviewedBy: '-',
      status: 'APPROVED',
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      date: '22/07/2025 13:30',
      flightVersion: 'Flight',

      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      departure: 'SAW',
      depTime: '05:05',
      arrival: 'ADB',
      arrTime:'06:14',
      totalTime: '06:14',


      updateDate: '30/07/2025 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN',
      status: 'REASSING',
    },
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.defineColumn();
  }

  defineColumn() {
    this.columns = [
      { field: 'crewNameSurname', header: 'Crew Name & Surname' },
      { field: 'companyId', header: 'Company ID' },
      { field: 'date', header: 'Date' },
      { field: 'flightVersion', header: 'Flight Version' },

      { field: 'aircraftType', header: 'A/C Type' },
      { field: 'aircraftReg', header: 'A/C Reg' },
      { field: 'departure', header: 'Departure' },

      { field: 'depTime', header: 'Dep. Time' },
      { field: 'arrival', header: 'Arrival' },
      { field: 'arrTime', header: 'Arr. Time' },
      
      { field: 'totalTime', header: 'Total Time' },

      

      { field: 'updateDate', header: 'Update Date' },
      { field: 'comment', header: 'Comment' },
      { field: 'reviewedBy', header: 'Reviewed By' },
      { field: 'status', header: 'Status' },

      { field: '', header: '', template: this.previewCellBodyTemplate },
      { field: '', header: '', template: this.editableCellBodyTemplate },
    ];
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

  onReject(rowData: any): void {
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
        this.selectedRow = rowData;
        this.displayRejectPopup = true;
      },
      reject: () => {
        console.log('Rejection cancelled.');
      },
    });
  }

  submitRejectReason(): void {
    console.log('Rejected Reason:', this.rejectReason);
    this.displayRejectPopup = false;
    this.rejectReason = '';
  }

  goToLogBookDetailEditPage(data: any) {
    this.router.navigate([
      'logbook/logbook-detail-edit',
      {
        data: JSON.stringify(data),
      },
    ]);
  }
}
