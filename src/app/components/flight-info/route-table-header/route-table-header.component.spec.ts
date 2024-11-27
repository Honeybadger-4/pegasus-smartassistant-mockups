import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteTableHeaderComponent } from './route-table-header.component';

describe('RouteTableHeaderComponent', () => {
  let component: RouteTableHeaderComponent;
  let fixture: ComponentFixture<RouteTableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteTableHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
