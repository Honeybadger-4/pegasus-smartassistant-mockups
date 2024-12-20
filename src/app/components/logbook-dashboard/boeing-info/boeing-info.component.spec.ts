import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoeingInfoComponent } from './boeing-info.component';

describe('BoeingInfoComponent', () => {
  let component: BoeingInfoComponent;
  let fixture: ComponentFixture<BoeingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoeingInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoeingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
