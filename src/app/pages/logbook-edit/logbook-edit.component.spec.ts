import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbookEditComponent } from './logbook-edit.component';

describe('LogbookEditComponent', () => {
  let component: LogbookEditComponent;
  let fixture: ComponentFixture<LogbookEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogbookEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogbookEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
