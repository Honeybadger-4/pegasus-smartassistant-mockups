import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAlternateRoutesCardComponent } from './top-alternate-routes-card.component';

describe('TopAlternateRoutesCardComponent', () => {
  let component: TopAlternateRoutesCardComponent;
  let fixture: ComponentFixture<TopAlternateRoutesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopAlternateRoutesCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopAlternateRoutesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
