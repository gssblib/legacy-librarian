import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsbnAssignmentPageComponent } from './isbn-assignment-page.component';

describe('IsbnAssignmentPageComponent', () => {
  let component: IsbnAssignmentPageComponent;
  let fixture: ComponentFixture<IsbnAssignmentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsbnAssignmentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsbnAssignmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
