import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiFieldSearchBarComponent } from './multi-field-search-bar.component';

describe('MultiFieldSearchBarComponent', () => {
  let component: MultiFieldSearchBarComponent;
  let fixture: ComponentFixture<MultiFieldSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiFieldSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFieldSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
