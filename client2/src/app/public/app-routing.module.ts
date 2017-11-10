import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NotFoundComponent } from "../not-found/not-found.component";
import { AuthGuard } from "../core/auth.guard";
import { HomeComponent } from "../home/home.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { ItemBrowserPageComponent } from './item-browser-page/item-browser-page.component';
import { CheckedOutPageComponent } from './checked-out-page/checked-out-page.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: HomeComponent},
      { path: 'items', component: ItemBrowserPageComponent },
      { path: 'checkedout', component:  CheckedOutPageComponent, canActivate: [AuthGuard]},

      { path: 'login', component: LoginPageComponent },
      { path: '**', component: NotFoundComponent },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
