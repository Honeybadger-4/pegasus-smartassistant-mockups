import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-logbook',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, TableModule],
  templateUrl: './logbook-definations.component.html',
  styleUrl: './logbook-definations.component.scss'
})

export class LogbookComponent {
  selectedPeriod: string = '';
  statusOptions = [
    { label: 'Status 1', value: 'status' },
    { label: 'Status 2', value: 'status' },
    { label: 'Status 3', value: 'status' },
  ];

  columns: Column[] = [];
  logbookData = [
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      uploadDate: '22/07/2025 13:30',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      status: 'APPROVED',
      updateDate: '-',
      comment: '-',
      reviewedBy: '-'
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      uploadDate: '22/07/2025 13:30',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      status: 'PENDING',
      updateDate: '30/07/2025 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN'
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      uploadDate: '22/07/2025 13:30',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      status: 'REASSING',
      updateDate: '30/07/2025 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN'
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      uploadDate: '22/07/2025 13:30',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      status: 'APPROVED',
      updateDate: '-',
      comment: '-',
      reviewedBy: '-'
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      uploadDate: '22/07/2025 13:30',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      status: 'PENDING',
      updateDate: '30/07/2025 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN'
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      uploadDate: '22/07/2025 13:30',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      status: 'REASSING',
      updateDate: '30/07/2025 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN'
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      uploadDate: '22/07/2025 13:30',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      status: 'APPROVED',
      updateDate: '-',
      comment: '-',
      reviewedBy: '-'
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      uploadDate: '22/07/2025 13:30',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      status: 'APPROVED',
      updateDate: '-',
      comment: '-',
      reviewedBy: '-'
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      uploadDate: '22/07/2025 13:30',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      status: 'PENDING',
      updateDate: '30/07/2025 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN'
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      uploadDate: '22/07/2025 13:30',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      status: 'APPROVED',
      updateDate: '-',
      comment: '-',
      reviewedBy: '-'
    },
    {
      crewNameSurname: 'SAWC BIR NCS YUZ YIRMI UC YUZ KIRK',
      companyId: '123140',
      uploadDate: '22/07/2025 13:30',
      aircraftType: 'B737',
      aircraftReg: 'TC-IZE',
      status: 'REASSING',
      updateDate: '30/07/2025 13:30',
      comment: 'Lorem Impsum',
      reviewedBy: 'ADMIN'
    },
    
   
  ];

  ngOnInit() {
    this.defineColumn();
  }

  defineColumn() {
    this.columns = [
      { field: 'crewNameSurname', header: 'Crew Name & Surname' },
      { field: 'companyId', header: 'Company ID' },
      { field: 'uploadDate', header: 'Upload Date' },
      { field: 'aircraftType', header: 'A/C Type' },
      { field: 'aircraftReg', header: 'A/C Reg' },
      { field: 'status', header: 'Status' },
      { field: 'updateDate', header: 'Update Date' },
      { field: 'comment', header: 'Comment' },
      { field: 'reviewedBy', header: 'Reviewed By' },


    ];
  }
}
