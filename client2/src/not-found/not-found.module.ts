import { NgModule } from '@angular/core';
import { NotFoundComponent } from './not-found.component';
import {MatCardModule} from "@angular/material/card";

@NgModule({
  declarations: [
    NotFoundComponent,
  ],
  imports: [
    MatCardModule,
  ],
  exports: [
    NotFoundComponent,
  ],
  providers: [
    NotFoundComponent,
  ],
  bootstrap: [NotFoundComponent]
})
export class NotFoundModule { }
