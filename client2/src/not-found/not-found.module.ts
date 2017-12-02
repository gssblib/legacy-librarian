import { NgModule } from '@angular/core';
import {
  MatCardModule,
} from '@angular/material';
import { NotFoundComponent } from './not-found.component';

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
