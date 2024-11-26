import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBreadcrumbComponent } from './custom-breadcrumb.component';

describe('CustomBreadcrumbComponent', () => {
  let component: CustomBreadcrumbComponent;
  let fixture: ComponentFixture<CustomBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomBreadcrumbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
