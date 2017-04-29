import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSearchPageComponent } from './item-search-page.component';

describe('ItemSearchPageComponent', () => {
  let component: ItemSearchPageComponent;
  let fixture: ComponentFixture<ItemSearchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSearchPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
