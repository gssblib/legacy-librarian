import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from "../../core/config.service";
import { RpcService } from "../../core/rpc.service";
import { NotificationService } from "../../core/notification-service";
import { Item } from "../shared/item";
import { ItemsService } from "../shared/items.service";
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable, of} from 'rxjs';
import { catchError,tap, take } from 'rxjs/operators';

@Component({
  selector: 'gsl-item-edit-cover',
  templateUrl: './item-edit-cover.component.html',
  styleUrls: ['./item-edit-cover.component.css'],
})
export class ItemEditCoverComponent implements OnInit {
  @Input('item') item: Item;

  private ref: AngularFireStorageReference;
  public url: Observable<string|null>;

  constructor(
    private rpc: RpcService,
    private notificationService: NotificationService,
    private itemsService: ItemsService,
    private config: ConfigService,
    private readonly storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.ref = this.storage.ref('covers/' + this.item.barcode + '.jpg');
    this.url = this.ref.getDownloadURL();
  }

  dragFilesDropped(droppedFile: any) {
    console.log("dropped", droppedFile);
  }

  /* Actions */
  deleteCover() {
    this.ref.delete().pipe(
      take(1),
      tap(()=>{
        console.log('delete the image successfully');
        this.url= of(null);
      }),
      catchError((error)=> {
        console.log('fail to delete', error);
        this.notificationService.showError("Failed to delete image");
        return of(null);
      }),
    ).subscribe();
  }
}
