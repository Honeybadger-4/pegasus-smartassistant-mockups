import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsSignalLossCardComponent } from './gps-signal-loss-card.component';

describe('GpsSignalLossCardComponent', () => {
  let component: GpsSignalLossCardComponent;
  let fixture: ComponentFixture<GpsSignalLossCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpsSignalLossCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsSignalLossCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
