import { Component, OnInit, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ConfigService } from "../../core/config.service";
import { RpcService } from "../../core/rpc.service";
import { NotificationService } from "../../core/notification-service";
import { Item } from "../shared/item";
import { ItemsService } from "../shared/items.service";
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

class CoverUploader extends FileUploader {
  itemCoverEdit;

  constructor(itemCoverEdit, options) {
    super(options)
    this.itemCoverEdit = itemCoverEdit;
  }

  public onSuccessItem(item:any, response:any, status:any, headers:any):any {
    // Force image reload.
    this.itemCoverEdit.urlHash = Math.random().toString();
    this.itemCoverEdit.hasCover = true;
    return {item, response, status, headers};
  }
}

@Component({
  selector: 'gsl-item-edit-cover',
  templateUrl: './item-edit-cover.component.html',
  styleUrls: ['./item-edit-cover.component.css'],
})
export class ItemEditCoverComponent implements OnInit {
  @Input('item') item: Item;
  url?: Observable<string|null>;

  public uploader: CoverUploader;
  public hasDropZoneOver:boolean = false;

  constructor(
    private rpc: RpcService,
    private notificationService: NotificationService,
    private itemsService: ItemsService,
    private config: ConfigService,
    private readonly storage: AngularFireStorage
  ) {}

  ngOnInit() {
    const ref = this.storage.ref('covers/' + this.item.barcode + '.jpg');
    this.url = ref.getDownloadURL();
    this.uploader = new CoverUploader(
      this, {
        url: "TODO(kbolay): WIP",
        authToken: this.rpc.getJWTAuthToken(),
        isHTML5: true,
        disableMultipart: false,
        removeAfterUpload: true,
        autoUpload: true,
    });
  }

  /* Hover and Drop state management */
  public fileOver(e:any):void {
    this.hasDropZoneOver = e;
  }

  /* Actions */
  deleteCover() {
    this.notificationService.showError("TODO(kbolay): implement");
  }
}
