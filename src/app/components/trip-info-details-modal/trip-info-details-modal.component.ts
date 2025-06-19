import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { ITripInfoDetailsResponse } from '@shared/models/trip-info-details-response.model';

@Component({
  selector: 'app-trip-info-details-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, CustomTableComponent],
  templateUrl: './trip-info-details-modal.component.html',
  styleUrl: './trip-info-details-modal.component.scss',
})
export class TripInfoDetailsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() details: ITripInfoDetailsResponse | null = null;

  tripInfoDetailsModalColumns = [
    { field: 'field', header: 'Field' },
    { field: 'value', header: 'Value' },
  ];

  get tripInfoDetailsModalData() {
    if (!this.details) return [];

    const d = this.details;

    return [
      { field: 'Crew Version', value: d.crewVersion },
      { field: 'Pantry Code', value: d.pantryCode },
      { field: 'DOW', value: d.dow },
      { field: 'DOI', value: d.doi },
      { field: 'MZFW', value: d.mzfw },
      { field: 'MTOW', value: d.mtow },
      { field: 'MLW', value: d.mlw },
      { field: 'MALTOW', value: d.maltow },
      { field: 'Block Fuel', value: d.blockFuel },
      { field: 'Taxi Fuel', value: d.taxiFuel },
      { field: 'Trip Fuel', value: d.tripFuel },
      { field: 'Take-Off Time', value: d.takeOffTime },
      { field: 'EET', value: d.eet },
      { field: 'EIC', value: '' },
      { field: 'EIC Adj', value: d.eicAdj },
      { field: 'Index Effect', value: d.indEffect },
    ];
  }

  closeModal() {
    this.visibleChange.emit(false);
  }
}
