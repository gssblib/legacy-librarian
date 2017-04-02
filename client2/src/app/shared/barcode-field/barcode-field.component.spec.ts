import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeFieldComponent } from './barcode-field.component';

describe('BarcodeFieldComponent', () => {
  let component: BarcodeFieldComponent;
  let fixture: ComponentFixture<BarcodeFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
