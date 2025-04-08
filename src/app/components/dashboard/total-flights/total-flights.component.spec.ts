import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalFlightsComponent } from './total-flights.component';

describe('TotalFlightsComponent', () => {
  let component: TotalFlightsComponent;
  let fixture: ComponentFixture<TotalFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalFlightsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
