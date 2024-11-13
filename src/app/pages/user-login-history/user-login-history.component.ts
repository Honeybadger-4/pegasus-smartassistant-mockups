import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CustomTableComponent } from 'src/app/components/custom-table/custom-table.component';
@Component({
  selector: 'app-user-login-history',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, CustomTableComponent],
  templateUrl: './user-login-history.component.html',
  styleUrl: './user-login-history.component.scss',
})
export class UserLoginHistoryComponent {
  selectedPeriod: string = '';
  periodOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];

  columns: Column[] = [];
  userLoginHistoryData = [
    {
      appVersion: '1.0.28',
      channel: 'MOBİLE',
      companyID: '123,133',
      deviceBrand: 'Apple',
      deviceID: '7DE72755-A0F0-42',
      deviceModel: 'İpad 8',
      ipAddress: '192.168.1.109',
      loggedInDate: '2024-02-28 13:13:33.965',
      os: 'IOS',
      osVersion: '17.3.1',
      userID: '1,241',
      username: 'SAWBCS01',
    },
    {
      appVersion: '1.0.28',
      channel: 'MOBİLE',
      companyID: '123,133',
      deviceBrand: 'Apple',
      deviceID: '7DE72755-A0F0-42',
      deviceModel: 'İpad 8',
      ipAddress: '192.168.1.109',
      loggedInDate: '2024-02-28 13:13:33.965',
      os: 'IOS',
      osVersion: '17.3.1',
      userID: '1,241',
      username: 'SAWBCS02',
    },
    {
      appVersion: '1.0.28',
      channel: 'MOBİLE',
      companyID: '123,133',
      deviceBrand: 'Apple',
      deviceID: '7DE72755-A0F0-42',
      deviceModel: 'İpad 8',
      ipAddress: '192.168.1.109',
      loggedInDate: '2024-02-28 13:13:33.965',
      os: 'IOS',
      osVersion: '17.3.1',
      userID: '1,241',
      username: 'SAWBCS03',
    },
    {
      appVersion: '1.0.28',
      channel: 'MOBİLE',
      companyID: '123,133',
      deviceBrand: 'Apple',
      deviceID: '7DE72755-A0F0-42',
      deviceModel: 'İpad 8',
      ipAddress: '192.168.1.109',
      loggedInDate: '2024-02-28 13:13:33.965',
      os: 'IOS',
      osVersion: '17.3.1',
      userID: '1,241',
      username: 'SAWBCS04',
    },
    {
      appVersion: '1.0.28',
      channel: 'MOBİLE',
      companyID: '123,133',
      deviceBrand: 'Apple',
      deviceID: '7DE72755-A0F0-42',
      deviceModel: 'İpad 8',
      ipAddress: '192.168.1.109',
      loggedInDate: '2024-02-28 13:13:33.965',
      os: 'IOS',
      osVersion: '17.3.1',
      userID: '1,241',
      username: 'SAWBCS05',
    },
    {
      appVersion: '1.0.28',
      channel: 'MOBİLE',
      companyID: '123,133',
      deviceBrand: 'Apple',
      deviceID: '7DE72755-A0F0-42',
      deviceModel: 'İpad 8',
      ipAddress: '192.168.1.109',
      loggedInDate: '2024-02-28 13:13:33.965',
      os: 'IOS',
      osVersion: '17.3.1',
      userID: '1,241',
      username: 'SAWBCS06',
    },
    {
      appVersion: '1.0.28',
      channel: 'MOBİLE',
      companyID: '123,133',
      deviceBrand: 'Apple',
      deviceID: '7DE72755-A0F0-42',
      deviceModel: 'İpad 8',
      ipAddress: '192.168.1.109',
      loggedInDate: '2024-02-28 13:13:33.965',
      os: 'IOS',
      osVersion: '17.3.1',
      userID: '1,241',
      username: 'SAWBCS07',
    },
  ];

  ngOnInit() {
    this.defineColumn();
  }

  defineColumn() {
    this.columns = [
      { field: 'appVersion', header: 'App Version' },
      { field: 'channel', header: 'Channel' },
      { field: 'companyID', header: 'Company ID' },
      { field: 'deviceBrand', header: 'Device Brand' },
      { field: 'deviceID', header: 'Device ID' },
      { field: 'deviceModel', header: 'Device Model' },
      { field: 'ipAddress', header: 'IP Address' },
      { field: 'loggedInDate', header: 'Logged In Date' },
      { field: 'os', header: 'OS' },
      { field: 'osVersion', header: 'OS Version' },
      { field: 'userID', header: 'User ID' },
      { field: 'username', header: 'Username' },
    ];
  }
}
