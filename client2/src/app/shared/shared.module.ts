import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyModule } from '@ngx-formly/core';
import { BarcodeFieldComponent } from './barcode-field/barcode-field.component';
import { IsbnFieldComponent } from './isbn-field/isbn-field.component';
import { AutofocusDirective } from './focus/autofocus.directive';
import { FocusDirective } from './focus/focus.directive';
import { MultiFieldSearchBarComponent } from './multi-field-search-bar/multi-field-search-bar.component';
import {
  LoginPageComponent,
  SycamoreLoginPageComponent,
  InternalLoginPageComponent,
} from './login-page/login-page.component';
import { ReadonlyFieldListComponent } from './readonly-field-list/readonly-field-list.component';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule,
  ],
  declarations: [
    BarcodeFieldComponent,
    IsbnFieldComponent,
    AutofocusDirective,
    FocusDirective,
    MultiFieldSearchBarComponent,
    LoginPageComponent,
    SycamoreLoginPageComponent,
    InternalLoginPageComponent,
    ReadonlyFieldListComponent,
  ],
  exports: [
    BarcodeFieldComponent,
    IsbnFieldComponent,
    MultiFieldSearchBarComponent,
    AutofocusDirective,
    FocusDirective,
    LoginPageComponent,
    SycamoreLoginPageComponent,
    InternalLoginPageComponent,
    ReadonlyFieldListComponent,
  ]
})
export class SharedModule { }
