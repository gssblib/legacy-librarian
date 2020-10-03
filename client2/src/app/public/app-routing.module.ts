import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "../core/auth.guard";
import { NotFoundComponent } from "../../not-found/not-found.component";
import { HomeComponent } from "../../home/home.component";
import { SycamoreLoginPageComponent } from "../shared/login-page/login-page.component";
import { CatalogSearchPageComponent } from './catalog-search-page/catalog-search-page.component';
import { CheckedOutPageComponent } from './checked-out-page/checked-out-page.component';
import { CatalogOrderPageComponent } from "./catalog-order-page/catalog-order-page.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'items',
        component: CatalogSearchPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'checkedout',
        component:  CheckedOutPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'order',
        component:  CatalogOrderPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'login',
        component: SycamoreLoginPageComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
