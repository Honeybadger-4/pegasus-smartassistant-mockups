import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPlanModalComponent } from './flight-plan-modal.component';

describe('FlightPlanModalComponent', () => {
  let component: FlightPlanModalComponent;
  let fixture: ComponentFixture<FlightPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightPlanModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
