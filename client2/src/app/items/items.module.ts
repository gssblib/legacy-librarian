import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemComponent } from "./item/item.component";
import { ItemsService } from "./shared/items.service";
import { ItemSearchComponent } from './item-search/item-search.component';
import { ItemPageComponent } from './item-page/item-page.component';

/**
 * Angular module for the items (books, CDs) in the library.
 *
 * The module provides the ItemsService communicating the backend and the components
 * for viewing and editing items.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ItemComponent,
    ItemSearchComponent,
    ItemPageComponent
  ],
  providers: [
    ItemsService
  ],
  exports: [
    ItemComponent,
    ItemSearchComponent,
    ItemPageComponent
  ]
})
export class ItemsModule { }
