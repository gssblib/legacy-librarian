import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAutoCompleteComponent } from './item-auto-complete.component';

describe('ItemAutoCompleteComponent', () => {
  let component: ItemAutoCompleteComponent;
  let fixture: ComponentFixture<ItemAutoCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemAutoCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
