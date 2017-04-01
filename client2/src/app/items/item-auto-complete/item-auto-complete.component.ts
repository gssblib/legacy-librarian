import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ItemsService } from "../shared/items.service";
import { Item } from "../shared/item";

@Component({
  selector: 'gsl-item-auto-complete',
  templateUrl: './item-auto-complete.component.html',
  styleUrls: ['./item-auto-complete.component.css']
})
export class ItemAutoCompleteComponent implements OnInit {
  suggestions: Item[];

  @Output()
  itemSelected: EventEmitter<Item> = new EventEmitter<Item>();

  selection: Item;

  constructor(private itemsService: ItemsService) { }

  ngOnInit() {
  }

  selected(value) {
    console.log('select: ' + this.selection.barcode);
    this.itemSelected.emit(this.selection);
  }

  findSuggestions(event) {
    const query = event.query;
    this.itemsService.getItems({title: query}, 0, 20, false).subscribe(
      items => {
        this.suggestions = items.rows;
      });
  }
}
