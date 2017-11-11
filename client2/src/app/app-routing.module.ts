import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { InternalLoginPageComponent } from "./shared/login-page/login-page.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: HomeComponent },

      { path: 'login', component: InternalLoginPageComponent },
      { path: '**', component: NotFoundComponent },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
