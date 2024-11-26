import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';


@Component({
  selector: 'app-logbook-edit',
  standalone: true,
  imports: [BreadcrumbModule,ButtonModule],
  templateUrl: './logbook-edit.component.html',
  styleUrl: './logbook-edit.component.scss'
})
export class LogbookEditComponent {
  editData: any;
  breadcrumbItems: { label: string; url?: string }[] = [];


  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const dataParam = this.route.snapshot.paramMap.get('data');
    if (dataParam) {
      this.editData = JSON.parse(dataParam);
      console.log(this.editData);
    }

    this.breadcrumbItems = [
      { label: 'Logbook', url: '/logbook' },
      { label: 'Edit Logbook' }
    ];
  }

  onSave() {
    console.log('Save butonuna tıklandı', this.editData);
  }

}
