import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { ITdDataTableColumn, TdDataTableComponent } from "@covalent/core";
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
  itemCountClass: string = '';

  @ViewChild('barcode')
  barcode: BarcodeFieldComponent;

  @ViewChild(TdDataTableComponent)
  dataTable: TdDataTableComponent;

  columns: ITdDataTableColumn[] = [
    {name: 'barcode', label: 'Barcode', width: 100},
    {name: 'title', label: 'Title'},
    {name: 'author', label: 'Author', width: 220},
    {name: 'subject', label: 'Subject', width: 200},
    {name: 'category', label: 'Category', width: 100},
  ]

  constructor(
    private itemsService: ItemsService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.returnedItems = this.getItems();
  }

  pulseCount() {
    this.itemCountClass = 'pulse';
    setTimeout(() => { this.itemCountClass = ''; }, 1000);
  }

  resetItems() {
    this.returnedItems = [];
    this.dataTable.refresh();
  }

  returnItem(barcode: string) {
    this.itemsService.returnItem(barcode)
      .catch((error: RpcError) => this.onError(barcode, error))
      .subscribe((item: Item) => this.onSuccess(item));
  }

  private onSuccess(item: Item) {
    this.returnedItems.push(item);
    this.storeItems(this.returnedItems);
    this.barcode.barcode = '';
    this.pulseCount();
    this.dataTable.refresh();
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

  private storeItems(items: Item[]) {
    localStorage.setItem('returnedItems', JSON.stringify(items));
  }

  private getItems(): any {
    const value = localStorage.getItem('returnedItems');
    return value ? JSON.parse(value) : [];
  }
}
