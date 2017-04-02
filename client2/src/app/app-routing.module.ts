import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./not-found/not-found.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: '**', component: NotFoundComponent },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
