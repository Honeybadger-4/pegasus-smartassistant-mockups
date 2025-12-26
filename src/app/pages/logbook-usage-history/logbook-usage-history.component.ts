import { Component, inject, signal, viewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '@shared/models/columns';
import { AdminLogbookService } from '@shared/services/admin-logbook.service';
import { CustomTableComponent } from '@shared/components/custom-table/custom-table.component';
import { CustomLineChartComponent } from '@shared/components/custom-line-chart/custom-line-chart.component';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';

@Component({
  selector: 'app-logbook-usage-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    CustomTableComponent,
    CustomLineChartComponent,
    ButtonModule,
  ],
  templateUrl: './logbook-usage-history.component.html',
})
export class LogbookUsageHistoryComponent implements OnInit {
  private adminLogbookService = inject(AdminLogbookService);
  customTableComponent = viewChild.required(CustomTableComponent);

  selectedType = signal<'DAILY' | 'WEEKLY' | 'MONTHLY'>('MONTHLY');

  dateRange: Date[] | null = null;
  startDate = signal<string>('2025-01-01T00:00:00');
  endDate = signal<string>('2025-12-31T23:59:59');

  chartTitle = signal<string>('Monthly Usage Trend');
  chartData = signal<any>({ labels: [], datasets: [] });
  chartOptions = signal<any>({
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  });

  tableData = signal<any[]>([]);
  tableLoading = signal<boolean>(false);
  totalRecords = signal<number>(0);

  currentPage = signal<number>(0);
  currentRows = signal<number>(20);

  columns = signal<Column[]>([]);

  ngOnInit(): void {
    this.defineColumns();
    this.refreshAll();
  }

  defineColumns() {
    this.columns.set([
      { field: 'userName', header: 'Username', isFilter: true },
      {
        field: 'simRecordsToBeSigned',
        header: 'Records to be signed in Simulator Flights',
      },
      { field: 'signedSimRecord', header: 'Signed in Simulator Flights' },
      {
        field: 'flightRecordsToBeSigned',
        header: 'Records to be signed in Flights',
      },
      { field: 'signedFlightRecord', header: 'Signed in Flights' },
    ]);
  }

  onSelectType(type: 'DAILY' | 'WEEKLY' | 'MONTHLY') {
    this.selectedType.set(type);

    this.chartTitle.set(
      type === 'DAILY'
        ? 'Daily Usage Trend'
        : type === 'WEEKLY'
          ? 'Weekly Usage Trend'
          : 'Monthly Usage Trend',
    );

    this.loadChart();
  }

  onDateRangeChange() {
    if (!this.dateRange || this.dateRange.length < 2) return;

    this.startDate.set(this.formatDate(this.dateRange[0]));
    this.endDate.set(this.formatDate(this.dateRange[1], true));

    this.currentPage.set(0);
    this.customTableComponent().resetTableFirstValue();

    this.refreshAll();
  }

  lazyLoadEvent(event: any) {
  const page = event.first / event.rows;
  const rows = event.rows;

  const filterValue =
    event.filters?.userName?.value?.trim() || null;

  this.currentPage.set(page);
  this.currentRows.set(rows);

  this.loadTable(page, rows, filterValue);
}



  refreshAll() {
    this.loadChart();
    this.loadTable(0, this.currentRows());
  }

  loadChart() {
    this.adminLogbookService
      .getLogbookUsageReport(
        this.selectedType(),
        this.startDate(),
        this.endDate(),
      )
      .subscribe({
        next: (usageReportList) => {
          if (!usageReportList?.length) {
            this.chartData.set({ labels: [], datasets: [] });
            return;
          }

          const labels = usageReportList.map(
            (usageReport) => usageReport.index,
          );

          const loggedInUsersData = usageReportList.map(
            (usageReport) => usageReport.numberOfLoggedInUsers,
          );

          const signedSimulatorData = usageReportList.map(
            (usageReport) => usageReport.numberOfSignedSim,
          );

          const signedFlightData = usageReportList.map(
            (usageReport) => usageReport.numberOfSignedFlight,
          );

          this.chartData.set({
            labels,
            datasets: [
              {
                label: 'Number of logged in users',
                data: loggedInUsersData,
                borderColor: '#FEB914',
                tension: 0.4,
              },
              {
                label: 'Number of signed records in simulator flights',
                data: signedSimulatorData,
                borderColor: '#00C0E8',
                tension: 0.4,
              },
              {
                label: 'Number of signed records in flights',
                data: signedFlightData,
                borderColor: '#6155F5',
                tension: 0.4,
              },
            ],
          });
        },
        error: () => {
          this.chartData.set({ labels: [], datasets: [] });
        },
      });
  }

  loadTable(page: number, size: number, filter?: string | null) {
  this.tableLoading.set(true);

  this.adminLogbookService
    .getLogbookUsage(
      page,
      size,
      'simRecordsToBeSigned,DESC',
      this.startDate(),
      this.endDate(),
      filter,
    )
    .subscribe({
      next: (res) => {
        this.tableData.set(res?.content ?? []);
        this.totalRecords.set(res?.totalElements ?? 0);
        this.tableLoading.set(false);
      },
      error: () => {
        this.tableData.set([]);
        this.tableLoading.set(false);
      },
    });
}



  formatDate(date: Date, endOfDay = false): string {
    return endOfDay
      ? moment(date).endOf('day').format('YYYY-MM-DDTHH:mm:ss')
      : moment(date).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
  }

  async exportPDF() {
    const element = document.getElementById('pdf-export-area');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#fff',
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      0,
      imgWidth,
      imgHeight,
    );
    pdf.save('logbook-usage-history.pdf');
  }
}
