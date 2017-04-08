import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsbnAssignmentPageComponent } from './isbn-assignment-page/isbn-assignment-page.component';
import { IsbnRoutingModule } from './isbn-routing.module';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
      SharedModule,
    IsbnRoutingModule,
  ],
  exports: [
  ],
  declarations: [IsbnAssignmentPageComponent]
})
export class IsbnModule { }
