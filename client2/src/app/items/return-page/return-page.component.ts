import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { ITdDataTableColumn } from "@covalent/core";
import { ItemsService } from "../shared/items.service";
import { Item } from "../shared/item";
import { ErrorService } from "../../core/error-service";
import { RpcError } from "../../core/rpc-error";
import { BarcodeFieldComponent } from "../../shared/barcode-field/barcode-field.component";

@Component({
  selector: 'gsl-return-page',
  templateUrl: './return-page.component.html',
  styleUrls: ['./return-page.component.css']
})
export class ReturnPageComponent implements OnInit {
  returnedItems: Item[] = [];
  @ViewChild('barcode')
  barcode: BarcodeFieldComponent;

  columns: ITdDataTableColumn[] = [
    {name: 'barcode', label: 'Barcode'},
    {name: 'title', label: 'Title'},
    {name: 'author', label: 'Author'},
    {name: 'subject', label: 'Subject'},
    {name: 'description', label: 'Description'},
  ]

  constructor(
    private itemsService: ItemsService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
  }

  returnItem(barcode: string) {
    console.log('return item: ' + barcode);
    this.itemsService.returnItem(barcode)
      .catch((error: RpcError) => this.onError(barcode, error))
      .subscribe((item: Item) => this.onSuccess(item));
  }

  private onSuccess(item: Item) {
    this.returnedItems.push(item);
    this.barcode.barcode = '';
    this.returnedItems = Array.from(this.returnedItems);
    console.log(this.returnedItems);
  }

  private onError(barcode: string, error: RpcError) {
    this.errorService.showError(this.toErrorMessage(barcode, error));
    this.barcode.barcode = '';
    // Resolve the error.
    return Observable.create(() => {});
  }

  private toErrorMessage(barcode: string, error: RpcError) {
    switch (error.errorCode) {
      case 'ENTITY_NOT_FOUND':
        return `Item with barcode ${barcode} does not exist`;
      case 'ITEM_NOT_CHECKED_OUT':
        return `Item with barcode ${barcode} is not checked out`;
      default:
        return `Server error: ${error.errorCode}`;
    }
  }
}
