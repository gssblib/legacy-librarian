
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ItemSearchComponent } from "./items/item-search/item-search.component";
import { ItemPageComponent } from "./items/item-page/item-page.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'items/:id', component: ItemPageComponent },
      { path: 'items', component: ItemSearchComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
