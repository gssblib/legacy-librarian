import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerHistoryComponent } from './borrower-history.component';

describe('BorrowerHistoryComponent', () => {
  let component: BorrowerHistoryComponent;
  let fixture: ComponentFixture<BorrowerHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
