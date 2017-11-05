import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ItemPageComponent } from "./item-page/item-page.component";
import { ItemAddPageComponent } from "./item-add-page/item-add-page.component";
import { ReturnPageComponent } from "./return-page/return-page.component";
import { ItemSearchPageComponent } from "./item-search-page/item-search-page.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'items/add', component: ItemAddPageComponent},
      {path: 'items/:id', component: ItemPageComponent},
      {path: 'items', component: ItemSearchPageComponent},
      {path: 'return', component: ReturnPageComponent},
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ItemsRoutingModule {
}
