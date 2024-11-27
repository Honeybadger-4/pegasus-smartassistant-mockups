import { Component } from '@angular/core';
import { RouteTableHeaderComponent } from '../../components/flight-info/route-table-header/route-table-header.component';


@Component({
  selector: 'app-route',
  standalone: true,
  imports: [RouteTableHeaderComponent],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss'
})
export class RouteComponent {

}
