import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ItemsModule } from './items/items.module';
import { AppRoutingModule } from './app-routing.module';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BorrowersModule } from './borrowers/borrowers.module';
import { HttpClientModule } from "@angular/common/http";
import { AppSearchBarComponent } from './app-search-bar/app-search-bar.component';
import { FeesModule } from './fees/fees.module';
import { ReportsModule } from './reports/reports.module';
import { ItemsRoutingModule } from "./items/items-routing.module";
import { BorrowersRoutingModule } from './borrowers/borrowers-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    AppSearchBarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    ItemsModule,
    BorrowersModule,
    FeesModule,
    ReportsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    /* List routers in the right order. */
    ItemsRoutingModule,
    BorrowersRoutingModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
