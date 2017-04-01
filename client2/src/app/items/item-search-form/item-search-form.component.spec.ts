import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSearchFormComponent } from './item-search-form.component';

describe('ItemSearchFormComponent', () => {
  let component: ItemSearchFormComponent;
  let fixture: ComponentFixture<ItemSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
