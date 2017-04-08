import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsbnFieldComponent } from './isbn-field.component';

describe('IsbnFieldComponent', () => {
  let component: IsbnFieldComponent;
  let fixture: ComponentFixture<IsbnFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsbnFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsbnFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
