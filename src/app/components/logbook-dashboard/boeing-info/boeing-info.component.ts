import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boeing-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boeing-info.component.html',
  styleUrl: './boeing-info.component.scss',
})
export class BoeingInfoComponent implements OnInit {
  ngOnInit(): void {}
}
