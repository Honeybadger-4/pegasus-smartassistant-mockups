import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPlansComponent } from './flight-plans.component';

describe('FlightPlansComponent', () => {
  let component: FlightPlansComponent;
  let fixture: ComponentFixture<FlightPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightPlansComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
