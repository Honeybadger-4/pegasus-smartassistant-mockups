import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalChecklistsComponent } from './personal-checklists.component';

describe('PersonalChecklistsComponent', () => {
  let component: PersonalChecklistsComponent;
  let fixture: ComponentFixture<PersonalChecklistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalChecklistsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalChecklistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
