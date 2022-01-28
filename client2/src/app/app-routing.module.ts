import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { NotFoundComponent } from "../not-found/not-found.component";
import { InternalLoginPageComponent } from "./shared/login-page/login-page.component";
import { CheckoutPageComponent } from "./checkouts/checkout-page/checkout-page.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
    { path: '', component: HomeComponent },
    { path: 'login', component: InternalLoginPageComponent },
    { path: 'checkout', component: CheckoutPageComponent },
    { path: '**', component: NotFoundComponent },
], { relativeLinkResolution: 'legacy' })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
