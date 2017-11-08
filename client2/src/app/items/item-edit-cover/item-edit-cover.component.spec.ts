import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemEditCoverComponent } from './item-edit-cover.component';

describe('ItemEditCoverComponent', () => {
  let component: ItemEditCoverComponent;
  let fixture: ComponentFixture<ItemEditCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemEditCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
