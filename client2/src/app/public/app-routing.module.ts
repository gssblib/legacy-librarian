import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NotFoundComponent } from "../not-found/not-found.component";
import { HomeComponent } from "../home/home.component";
import { ItemBrowserPageComponent } from './item-browser-page/item-browser-page.component';
import { CheckedOutPageComponent } from './checked-out-page/checked-out-page.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'items', component: ItemBrowserPageComponent },
      { path: 'checkedout', component:  CheckedOutPageComponent},
      { path: '**', component: NotFoundComponent },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
