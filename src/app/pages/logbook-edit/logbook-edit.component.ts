import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logbook-edit',
  standalone: true,
  imports: [],
  templateUrl: './logbook-edit.component.html',
  styleUrl: './logbook-edit.component.scss'
})
export class LogbookEditComponent {
  editData: any

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const dataParam = this.route.snapshot.paramMap.get('data');
    if (dataParam) {
      this.editData = JSON.parse(dataParam);
      console.log(this.editData);
    }
  }

}
