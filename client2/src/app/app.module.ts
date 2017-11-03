import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ItemsModule } from './items/items.module';
import { AppRoutingModule } from './app-routing.module';
import { MatIconModule, MatListModule, MatSidenavModule, MatSnackBarModule, MatToolbarModule } from '@angular/material';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BorrowersModule } from './borrowers/borrowers.module';
import { IsbnModule } from './isbn/isbn.module';
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    ItemsModule,
    BorrowersModule,
    IsbnModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
