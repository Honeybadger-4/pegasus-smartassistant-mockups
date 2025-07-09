import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { IReportsContentData } from '@shared/models/reports-response.model';

@Component({
  selector: 'app-reports-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, TabsModule],
  templateUrl: './reports-modal.component.html',
  styleUrl: './reports-modal.component.scss',
})
export class ReportsModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() rowData: IReportsContentData | null = null;

  flightFields: any[] = [];
  passengerFields: any[] = [];
  fuelFields: any[] = [];
  oilFields: any[] = [];
  divertFields: any[] = [];

  ngOnInit(): void {
    if (this.rowData) {
      this.prepareFields();
    }
  }

  ngOnChanges(): void {
    if (this.rowData) {
      this.prepareFields();
    }
  }

  prepareFields() {
    this.flightFields = [
      { label: 'Door Closed', value: this.rowData?.doorClosed },
      { label: 'Off Block', value: this.rowData?.offBlock },
      { label: 'Take Off', value: this.rowData?.takeOff },
      { label: 'Landing', value: this.rowData?.landing },
      { label: 'On Block', value: this.rowData?.onBlock },
      { label: 'Door Open', value: this.rowData?.doorOpen },
      { label: 'Flight Hours', value: this.rowData?.flightHours },
      { label: 'Block Hours', value: this.rowData?.blockHours },
    ];

    this.passengerFields = [
      { label: 'Adult', value: this.rowData?.adult },
      { label: 'Child', value: this.rowData?.child },
      { label: 'Infant', value: this.rowData?.infant },
      { label: 'Pick Up Pax', value: this.rowData?.pickUpPax },
      { label: 'Non Revenue', value: this.rowData?.nonRevenue },
      { label: 'De-icing', value: this.rowData?.deIcing ? 'Yes' : 'No' },
    ];

    this.fuelFields = [
      { label: 'Remaining Fuel', value: this.rowData?.remainingFuel },
      { label: 'OFP Plan Fuel', value: this.rowData?.ofpFuel },
      { label: 'Uplift Fuel (lt)', value: this.rowData?.upliftFuel },
      { label: 'Uplift Time', value: this.rowData?.upliftTime },
      { label: 'Density (kg/lt)', value: this.rowData?.density },
      { label: 'Total Fuel', value: this.rowData?.totalFuel },
      { label: 'Gauges Sum After', value: this.rowData?.gaugesSumAfter },
      { label: 'Landing Fuel', value: this.rowData?.landingFuel },
      {
        label: 'Reason of Excess Fuel',
        value: this.rowData?.excessFuelReasons,
      },
    ];

    this.oilFields = [
      { label: 'Oil Before Eng 1', value: this.rowData?.oilBeforeEngOne },
      { label: 'Oil Before Eng 2', value: this.rowData?.oilBeforeEngTwo },
      { label: 'Oil After Eng 1', value: this.rowData?.oilAfterEngOne },
      { label: 'Oil After Eng 2', value: this.rowData?.oilAfterEngTwo },
      { label: 'Landing Wind Report', value: this.rowData?.landingWindReport },
      {
        label: 'Hyd Green Checked',
        value: this.rowData?.isHydGreenChecked ? 'Yes' : 'No' },
      {
        label: 'Hyd Blue Checked',
        value: this.rowData?.isHydBlueChecked ? 'Yes' : 'No' },
      {
        label: 'Hyd Yellow Checked',
        value: this.rowData?.isHydYellowChecked ? 'Yes' : 'No' },
    ];

    this.divertFields = [
      { label: 'Divert Airport Code', value: this.rowData?.divertAirportCode },
      { label: 'Divert Airport ICAO', value: this.rowData?.divertAirportIcao },
      { label: 'Autoland Info', value: this.rowData?.autolandInfoMessage },
      ...(this.rowData?.delayReasons?.map((dr) => ({
        label: `Delay Code ${dr.code}`,
        value: `Time: ${dr.delayedTime}, Comment: ${dr.comment}`,
      })) || []),
    ];
  }

  closeModal() {
    this.visibleChange.emit(false);
  }
}
