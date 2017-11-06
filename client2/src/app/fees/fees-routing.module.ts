import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FeesPageComponent } from "./fees-page/fees-page.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'fees', component: FeesPageComponent},
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class FeesRoutingModule {
}
