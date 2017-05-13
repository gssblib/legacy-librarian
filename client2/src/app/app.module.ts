import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { ItemsModule } from "./items/items.module";
import { AppRoutingModule } from "./app-routing.module";
import { MaterialModule, MdSnackBarModule } from "@angular/material";
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BorrowersModule } from "./borrowers/borrowers.module";
import { IsbnModule } from "./isbn/isbn.module";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CoreModule,
    MaterialModule,
    ItemsModule,
    BorrowersModule,
    IsbnModule,
    AppRoutingModule,
    MdSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
