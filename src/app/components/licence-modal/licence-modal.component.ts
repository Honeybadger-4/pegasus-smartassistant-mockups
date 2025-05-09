import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { ILicenceInfoContentData } from '@shared/models/licence-info-response.model';
import moment from 'moment';

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
  @Input() rowData: ILicenceInfoContentData | null = null;

  licenceModalColumns = [
    { field: 'licenceName', header: 'Licence Name' },
    { field: 'issueDate', header: 'Issue Date' },
    { field: 'expDate', header: 'Expire Date' },
  ];

  get licenceModalData() {
    if (!this.rowData) return [];

    return this.rowData.licenceListResponse.licenseList.map((item) => ({
      licenceName: item.licenceName,
      issueDate: item.issueDate
        ? moment(item.issueDate).format('DD/MM/YYYY - HH:mm')
        : undefined,
      expireDate: item.expDate
        ? moment(item.expDate).format('DD/MM/YYYY - HH:mm')
        : undefined,
    }));
  }

  closeModal() {
    this.visibleChange.emit(false);
  }
}
