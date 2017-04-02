import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerProfileComponent } from './borrower-profile.component';

describe('BorrowerProfileComponent', () => {
  let component: BorrowerProfileComponent;
  let fixture: ComponentFixture<BorrowerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
