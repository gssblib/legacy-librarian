import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ItemsService } from "../shared/items.service";
import { Item } from "../shared/item";
import { FormControl } from "@angular/forms";

/**
 * Auto-complete component for items using the item title (or parts of it) for the
 * completion.
 */
@Component({
  selector: 'gsl-item-auto-complete',
  templateUrl: './item-auto-complete.component.html',
  styleUrls: ['./item-auto-complete.component.css']
})
export class ItemAutoCompleteComponent implements OnInit {
  /** FormControl for the input field. */
  itemCtrl: FormControl;

  /** Items shown in auto completion list. */
  suggestions: Item[];

  @Output()
  itemSelected: EventEmitter<Item> = new EventEmitter<Item>();

  @Input()
  size: number = 20;

  constructor(private itemsService: ItemsService) { }

  ngOnInit() {
    this.itemCtrl = new FormControl();
    this.itemCtrl.valueChanges.subscribe(value => this.onChange(value));
  }

  /**
   * Handles changes of the input field.
   *
   * While typing, the value is a string, and we fetch new suggestions. When one of
   * the items is selected, the value is the Item object, and we emit the borrowerChange event.
   *
   * This doesn't look like the best way to get notified of the selection, but I couldn't
   * find a more direct way, for example, an event on the md-autocomplete element.
   */
  private onChange(value) {
    if (typeof value === 'object') {
      this.suggestions = [];
      this.itemCtrl.setValue('');
      this.itemSelected.emit(value);
    } else {
      this.fetchSuggestions(value)
    }
  }

  /**
   * Sets the suggestions to the first matching items fetched from the server.
   */
  private fetchSuggestions(title) {
    if (title === '') {
      this.suggestions = [];
    } else {
      this.itemsService.getItems({title: title}, 0, this.size, false).subscribe(
        items => {
          this.suggestions = items.rows;
        });
    }
  }

  /**
   * Returns the string shown for an Item in the widget.
   */
  displayWith(item: Item): string {
    return item ? item.title : '';
  }
}
