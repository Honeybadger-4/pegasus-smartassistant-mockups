import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirbusInfoComponent } from './airbus-info.component';

describe('AirbusInfoComponent', () => {
  let component: AirbusInfoComponent;
  let fixture: ComponentFixture<AirbusInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirbusInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AirbusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
