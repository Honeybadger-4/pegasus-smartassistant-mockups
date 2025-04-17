import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCountCardComponent } from './flight-count-card.component';

describe('FlightCountCardComponent', () => {
  let component: FlightCountCardComponent;
  let fixture: ComponentFixture<FlightCountCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightCountCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightCountCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
