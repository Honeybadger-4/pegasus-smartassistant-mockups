import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInformationCardComponent } from './general-information-card.component';

describe('GeneralInformatiobCardComponent', () => {
  let component: GeneralInformationCardComponent;
  let fixture: ComponentFixture<GeneralInformationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralInformationCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralInformationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
