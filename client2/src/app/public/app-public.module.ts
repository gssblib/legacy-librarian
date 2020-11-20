import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundModule } from '../../not-found/not-found.module';
import { HomeModule } from '../../home/home.module';
import { CoreModule } from '../core/core.module';
import { ItemsModule } from '../items/items.module';
import { BorrowersModule } from '../borrowers/borrowers.module';
import { AppRoutingModule } from './app-routing.module';
import { AppPublicComponent } from './app-public.component';
import { CatalogSearchPageComponent } from './catalog-search-page/catalog-search-page.component';
import { RouterModule } from '@angular/router';
import { CheckedOutPageComponent } from './checked-out-page/checked-out-page.component';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CatalogItemCardComponent } from './catalog-item-card/catalog-item-card.component';
import { CatalogOrderPageComponent } from './catalog-order-page/catalog-order-page.component';
import { CatalogOrderComponent } from './catalog-order/catalog-order.component';
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    NotFoundModule,
    HomeModule,
    SharedModule,
    AppRoutingModule,
    ItemsModule,
    BorrowersModule,
    MatTooltipModule,
    AngularFireModule.initializeApp(environment.firebase.public),
    AngularFireStorageModule,
  ],
  declarations: [
    AppPublicComponent,
    CatalogSearchPageComponent,
    CheckedOutPageComponent,
    CatalogItemCardComponent,
    CatalogOrderPageComponent,
    CatalogOrderComponent,
  ],
  providers: [],
  bootstrap: [
    AppPublicComponent
  ]
})
export class AppPublicModule {
}
