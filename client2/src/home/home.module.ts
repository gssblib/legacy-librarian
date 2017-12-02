import { NgModule } from '@angular/core';
import {
  MatCardModule,
} from '@angular/material';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    MatCardModule,
  ],
  exports: [
    HomeComponent,
  ],
  providers: [
    HomeComponent,
  ],
  bootstrap: [HomeComponent]
})
export class HomeModule { }
