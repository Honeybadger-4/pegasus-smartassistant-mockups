import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyStatsCardComponent } from './key-stats-card.component';

describe('KeyStatsCardComponent', () => {
  let component: KeyStatsCardComponent;
  let fixture: ComponentFixture<KeyStatsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyStatsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyStatsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
