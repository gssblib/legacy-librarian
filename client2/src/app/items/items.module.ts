import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemComponent } from "./item/item.component";
import { ItemsService } from "./shared/items.service";
import { ItemSearchComponent } from './item-search/item-search.component';
import { ItemPageComponent } from './item-page/item-page.component';
import { ItemAutoCompleteComponent } from './item-auto-complete/item-auto-complete.component';
import { AutoCompleteModule } from "primeng/primeng";
import { FormsModule } from "@angular/forms";
import { ItemSearchFormComponent } from './item-search-form/item-search-form.component';

/**
 * Angular module for the items (books, CDs) in the library.
 *
 * The module provides the ItemsService communicating the backend and the components
 * for viewing and editing items.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    ItemComponent,
    ItemSearchComponent,
    ItemPageComponent,
    ItemAutoCompleteComponent,
    ItemSearchFormComponent
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
