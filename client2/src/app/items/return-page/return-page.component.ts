import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemsService } from '../shared/items.service';
import { Item } from '../shared/item';
import { RpcError } from '../../core/rpc-error';
import { BarcodeFieldComponent } from '../../shared/barcode-field/barcode-field.component';
import { NotificationService } from "../../core/notification-service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'gsl-return-page',
  templateUrl: './return-page.component.html',
  styleUrls: ['./return-page.component.css']
})
export class ReturnPageComponent implements OnInit {
  displayedColumns = ['barcode', 'title', 'category', 'checkout_date', 'returndate', 'borrower'];
  returnedItems: Item[] = [];
  returnedItem?: Item = null;
  dataSource = new MatTableDataSource<Object>([]);

  @ViewChild('barcode', { static: true })
  barcode: BarcodeFieldComponent;

  constructor(private itemsService: ItemsService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.returnedItems = this.getItems();
    this.dataSource.data = this.returnedItems;
  }

  resetItems() {
    this.returnedItems = [];
    this.storeItems(this.returnedItems);
    this.dataSource.data = this.returnedItems;
  }

  returnItem(barcode: string) {
    this.itemsService.returnItem(barcode)
      .pipe(catchError((error: RpcError) => this.onError(barcode, error)))
      .subscribe((item: Item) => this.onSuccess(item));
  }

  private onSuccess(item: Item) {
    console.log(item);
    this.returnedItems.unshift(item);
    this.storeItems(this.returnedItems);
    this.barcode.barcode = '';
    this.dataSource.data = this.returnedItems;
    this.returnedItem = item;
    setTimeout(() => this.returnedItem = null, 1000);
  }

  private onError(barcode: string, error: RpcError) {
    this.notificationService.showError(this.toErrorMessage(barcode, error));
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
