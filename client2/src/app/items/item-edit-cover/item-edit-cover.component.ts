import { Component, OnInit, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ConfigService } from "../../core/config.service";
import { NotificationService } from "../../core/notification-service";
import { Item } from "../shared/item";
import { ItemsService } from "../shared/items.service";


class CoverUploader extends FileUploader {
  itemCoverEdit;

  constructor(itemCoverEdit, options) {
    super(options)
    this.itemCoverEdit = itemCoverEdit;
  }

  public onSuccessItem(item:any, response:any, status:any, headers:any):any {
    // Force image reload.
    this.itemCoverEdit.coverUrlShown = this.itemCoverEdit.coverUrl + '?random=' + Math.random();
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
  public hasCover:boolean = true;
  private coverUrl: string;
  public coverUrlShown: string;

  public uploader: CoverUploader;
  public hasDropZoneOver:boolean = false;

  constructor(
    private notificationService: NotificationService,
    private itemsService: ItemsService,
    private config: ConfigService
  ) { }

  ngOnInit() {
    this.coverUrl = this.coverUrlShown = this.config.apiPath('items/' + this.item.barcode + '/cover');
    this.uploader = new CoverUploader(
      this, {
      url: this.coverUrl,
      isHTML5: true,
      disableMultipart: false,
      removeAfterUpload: true,
      autoUpload: true,
    });
  }

  handleMissingImage() {
    this.hasCover = false;
  }

  /* Hover and Drop state management */
  public fileOver(e:any):void {
    this.hasDropZoneOver = e;
  }

  /* Actions */
  deleteCover() {
    this.itemsService.deleteCover(this.item).subscribe(
      () => {
        this.notificationService.show('Cover deleted.');
        this.handleMissingImage();
      },
      error => {
        this.notificationService.showError(error.data.status);
      }
    );
  }

}
