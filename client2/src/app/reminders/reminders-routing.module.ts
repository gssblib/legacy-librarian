import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RemindersPageComponent } from "./reminders-page/reminders-page.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'reminders', component: RemindersPageComponent},
    ]),
  ],
  exports: [
    RouterModule
  ]
})
export class RemindersRoutingModule {
}
