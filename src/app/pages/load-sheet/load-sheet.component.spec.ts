import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadSheetComponent } from './load-sheet.component';

describe('LoadSheetComponent', () => {
  let component: LoadSheetComponent;
  let fixture: ComponentFixture<LoadSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
