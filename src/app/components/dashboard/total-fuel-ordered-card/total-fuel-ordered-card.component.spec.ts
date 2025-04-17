import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalFuelOrderedCardComponent } from './total-fuel-ordered-card.component';

describe('TotalFuelOrderedCardComponent', () => {
  let component: TotalFuelOrderedCardComponent;
  let fixture: ComponentFixture<TotalFuelOrderedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalFuelOrderedCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalFuelOrderedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
