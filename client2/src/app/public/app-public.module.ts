import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
  MatToolbarModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { CoreModule } from '../core/core.module';
import { HomeComponent } from '../home/home.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { AppSearchBarComponent } from './app-search-bar/app-search-bar.component';
import { ItemsModule } from '../items/items.module';
import { BorrowersModule } from '../borrowers/borrowers.module';
import { AppRoutingModule } from './app-routing.module';
import { AppPublicComponent } from './app-public.component';
import { ItemBrowserPageComponent } from './item-browser-page/item-browser-page.component';
import { RouterModule } from "@angular/router";
import { CheckedOutPageComponent } from './checked-out-page/checked-out-page.component';
import { SharedModule } from "../shared/shared.module";

import { CovalentDataTableModule, CovalentPagingModule } from '@covalent/core';
import { LoginPageComponent } from './login-page/login-page.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    CovalentDataTableModule,
    CovalentPagingModule,
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
    MatPaginatorModule,
    MatProgressSpinnerModule,
    SharedModule,
    AppRoutingModule,
    ItemsModule,
    BorrowersModule,
  ],
  declarations: [
    AppPublicComponent,
    HomeComponent,
    NotFoundComponent,
    ItemBrowserPageComponent,
    AppSearchBarComponent,
    CheckedOutPageComponent,
    LoginPageComponent,
  ],
  providers: [
  ],
  bootstrap: [
    AppPublicComponent
  ]
})
export class AppPublicModule { }
