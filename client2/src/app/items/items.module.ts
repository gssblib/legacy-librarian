import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemComponent } from "./item/item.component";
import { ItemsService } from "./shared/items.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ItemComponent
  ],
  providers: [
    ItemsService
  ],
  exports: [
    ItemComponent
  ]
})
export class ItemsModule { }
