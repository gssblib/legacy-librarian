import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerFeesComponent } from './borrower-fees.component';

describe('BorrowerFeesComponent', () => {
  let component: BorrowerFeesComponent;
  let fixture: ComponentFixture<BorrowerFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
