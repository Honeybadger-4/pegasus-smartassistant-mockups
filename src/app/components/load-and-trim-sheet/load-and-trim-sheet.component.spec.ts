import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadAndTrimSheetComponent } from './load-and-trim-sheet.component';

describe('LoadAndTrimSheetComponent', () => {
  let component: LoadAndTrimSheetComponent;
  let fixture: ComponentFixture<LoadAndTrimSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadAndTrimSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadAndTrimSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
