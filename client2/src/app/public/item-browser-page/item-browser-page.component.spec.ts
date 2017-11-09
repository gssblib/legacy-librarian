import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBrowserPageComponent } from './item-browser-page.component';

describe('ItemBrowserPageComponent', () => {
  let component: ItemBrowserPageComponent;
  let fixture: ComponentFixture<ItemBrowserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemBrowserPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemBrowserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
