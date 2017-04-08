import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerAutoCompleteComponent } from './borrower-auto-complete.component';

describe('BorrowerAutoCompleteComponent', () => {
  let component: BorrowerAutoCompleteComponent;
  let fixture: ComponentFixture<BorrowerAutoCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerAutoCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
