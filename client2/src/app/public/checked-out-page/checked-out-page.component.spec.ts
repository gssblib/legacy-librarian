import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedOutPageComponent } from './checked-out-page.component';

describe('CheckedOutPageComponent', () => {
  let component: CheckedOutPageComponent;
  let fixture: ComponentFixture<CheckedOutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckedOutPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckedOutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
