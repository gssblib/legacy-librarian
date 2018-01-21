import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ItemsService } from '../shared/items.service';
import { Item } from '../shared/item';
import { ErrorService } from '../../core/error-service';
import { RpcError } from '../../core/rpc-error';
import { BarcodeFieldComponent } from '../../shared/barcode-field/barcode-field.component';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'gsl-return-page',
  templateUrl: './return-page.component.html',
  styleUrls: ['./return-page.component.css']
})
export class ReturnPageComponent implements OnInit {
  displayedColumns = ['barcode', 'title', 'category'];
  returnedItems: Item[] = [];
  dataSource = new MatTableDataSource<Object>([]);
  itemCountClass: string = '';

  @ViewChild('barcode')
  barcode: BarcodeFieldComponent;

  constructor(private itemsService: ItemsService,
              private errorService: ErrorService) {
  }

  ngOnInit() {
    this.returnedItems = this.getItems();
    this.dataSource.data = this.returnedItems;
  }

  pulseCount() {
    this.itemCountClass = 'pulse';
    setTimeout(() => { this.itemCountClass = ''; }, 1000);
  }

  resetItems() {
    this.returnedItems = [];
    this.dataSource.data = this.returnedItems;
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
    this.dataSource.data = this.returnedItems;
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
