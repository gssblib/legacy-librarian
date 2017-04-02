import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerSearchPageComponent } from './borrower-search-page.component';

describe('BorrowerSearchPageComponent', () => {
  let component: BorrowerSearchPageComponent;
  let fixture: ComponentFixture<BorrowerSearchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerSearchPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
