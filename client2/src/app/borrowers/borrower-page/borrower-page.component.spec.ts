import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerPageComponent } from './borrower-page.component';

describe('BorrowerPageComponent', () => {
  let component: BorrowerPageComponent;
  let fixture: ComponentFixture<BorrowerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
