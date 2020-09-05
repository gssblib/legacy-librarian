import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import {MatCardModule} from "@angular/material/card";

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
