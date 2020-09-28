import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemResolverService } from 'app/items/shared/item.resolver.service';
import { ItemPageComponent } from './item-page/item-page.component';
import { ItemAddPageComponent } from './item-add-page/item-add-page.component';
import { ReturnPageComponent } from './return-page/return-page.component';
import { ItemSearchPageComponent } from './item-search-page/item-search-page.component';
import { ItemHistoryComponent } from './item-history/item-history.component';
import { ItemLabelsComponent } from './item-labels/item-labels.component';
import { ItemDetailsComponent } from './item-details/item-details.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'return',
        component: ReturnPageComponent,
      },
      {
        path: 'items/add',
        component: ItemAddPageComponent,
      },
      {
        path: 'items/:id',
        component: ItemPageComponent,
        resolve: {
          item: ItemResolverService,
        },
        children: [
          {path: '', pathMatch: 'full', redirectTo: 'details'},
          {path: 'details', component: ItemDetailsComponent},
          {path: 'history', component: ItemHistoryComponent},
          {path: 'labels', component: ItemLabelsComponent},
        ]
      },
      {
        path: 'items',
        component: ItemSearchPageComponent,
      },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ItemsRoutingModule {
}
