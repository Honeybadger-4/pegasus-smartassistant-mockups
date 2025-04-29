import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';

@Component({
  selector: 'app-licence-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, CustomTableComponent],
  templateUrl: './licence-modal.component.html',
  styleUrl: './licence-modal.component.scss',
})
export class LicenceModalComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  licenceModalColumns = [
    { field: 'licenceName', header: 'Licence Name', isFilter: true },
    { field: 'issueDate', header: 'Issue Date', isFilter: true },
    { field: 'expireDate', header: 'Expire Date', isFilter: true },
  ];

  licenceModalData = [
    { licenceName: 'OPC', issueDate: '01/01/2020', expireDate: '01/01/2020' },
    { licenceName: 'CGO', issueDate: '01/01/2020', expireDate: '01/01/2020' },
    {
      licenceName: 'Line Check',
      issueDate: '01/01/2020',
      expireDate: '01/01/2020',
    },
    { licenceName: 'LPC', issueDate: '01/01/2020', expireDate: '01/01/2020' },
  ];

  closeModal() {
    this.visibleChange.emit(false);
  }
}
