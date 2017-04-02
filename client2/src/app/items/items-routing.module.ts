
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ItemSearchComponent } from "./item-search/item-search.component";
import { ItemPageComponent } from "./item-page/item-page.component";
import { ReturnPageComponent } from "./return-page/return-page.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'items/:id', component: ItemPageComponent },
      { path: 'items', component: ItemSearchComponent },
      { path: 'return', component: ReturnPageComponent },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ItemsRoutingModule {
}
