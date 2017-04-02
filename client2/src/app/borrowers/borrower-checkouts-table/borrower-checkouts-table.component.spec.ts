import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerCheckoutsTableComponent } from './borrower-checkouts-table.component';

describe('BorrowerCheckoutsTableComponent', () => {
  let component: BorrowerCheckoutsTableComponent;
  let fixture: ComponentFixture<BorrowerCheckoutsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerCheckoutsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerCheckoutsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
