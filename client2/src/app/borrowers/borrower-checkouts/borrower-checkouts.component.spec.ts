import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerCheckoutsComponent } from './borrower-checkouts.component';

describe('BorrowerCheckoutsComponent', () => {
  let component: BorrowerCheckoutsComponent;
  let fixture: ComponentFixture<BorrowerCheckoutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerCheckoutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerCheckoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
