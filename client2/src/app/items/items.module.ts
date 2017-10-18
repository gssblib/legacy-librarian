import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemComponent } from "./item/item.component";
import { ItemsService } from "./shared/items.service";
import { ItemPageComponent } from './item-page/item-page.component';
import { ItemAutoCompleteComponent } from './item-auto-complete/item-auto-complete.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ItemSearchFormComponent } from './item-search-form/item-search-form.component';
import { ItemSearchBarComponent } from './item-search-bar/item-search-bar.component';
import { ItemsTableComponent } from './items-table/items-table.component';
import { CovalentDataTableModule, CovalentPagingModule } from '@covalent/core';
import { ReturnPageComponent } from './return-page/return-page.component';
import { ItemsRoutingModule } from "./items-routing.module";
import { SharedModule } from "../shared/shared.module";
import { ItemSearchPageComponent } from './item-search-page/item-search-page.component';
import {
  MatAutocompleteModule, MatCardModule, MatIconModule, MatInputModule,
  MatOptionModule
} from '@angular/material';

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
    ReactiveFormsModule,
    CovalentDataTableModule,
    CovalentPagingModule,
    ItemsRoutingModule,
    SharedModule,
    MatCardModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
  ],
  declarations: [
    ItemComponent,
    ItemPageComponent,
    ItemAutoCompleteComponent,
    ItemSearchFormComponent,
    ItemSearchBarComponent,
    ItemsTableComponent,
    ReturnPageComponent,
    ItemSearchPageComponent,
  ],
  providers: [
    ItemsService
  ],
  exports: [
    ItemComponent,
    ItemAutoCompleteComponent,
    ItemSearchBarComponent,
    ItemPageComponent,
    ItemsTableComponent,
  ]
})
export class ItemsModule { }
