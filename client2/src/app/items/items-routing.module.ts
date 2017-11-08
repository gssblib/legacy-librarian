import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ItemResolverService } from 'app/items/shared/item.resolver.service';
import { ItemPageComponent } from "./item-page/item-page.component";
import { ItemAddPageComponent } from "./item-add-page/item-add-page.component";
import { ReturnPageComponent } from "./return-page/return-page.component";
import { ItemSearchPageComponent } from "./item-search-page/item-search-page.component";
import { ItemEditFormComponent } from "./item-edit-form/item-edit-form.component";
import { ItemHistoryComponent } from "./item-history/item-history.component";
import { ItemLabelsComponent } from "./item-labels/item-labels.component";


@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'return', component: ReturnPageComponent},
      {path: 'items', component: ItemSearchPageComponent},
      {path: 'items/add', component: ItemAddPageComponent},
      {path: 'items/:id', component: ItemPageComponent,
       resolve: {
         item: ItemResolverService,
       },
       children: [
          {path: 'details', component: ItemEditFormComponent},
          {path: 'history', component: ItemHistoryComponent},
          {path: 'labels', component: ItemLabelsComponent},
        ]
      },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ItemsRoutingModule {
}
