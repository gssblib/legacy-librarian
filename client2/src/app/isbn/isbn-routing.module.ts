import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IsbnAssignmentPageComponent } from './isbn-assignment-page/isbn-assignment-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'isbn', component: IsbnAssignmentPageComponent },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class IsbnRoutingModule {
}
