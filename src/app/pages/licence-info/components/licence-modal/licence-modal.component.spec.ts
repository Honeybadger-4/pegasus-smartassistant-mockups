import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceModalComponent } from './licence-modal.component';

describe('LicenceModalComponent', () => {
  let component: LicenceModalComponent;
  let fixture: ComponentFixture<LicenceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
