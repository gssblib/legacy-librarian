import { Component, OnInit, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
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
  hasCover:boolean = true;
  coverUrl: string;
  coverUrlShown: string;

  public uploader: CoverUploader;
  public hasDropZoneOver:boolean = false;

  constructor(private itemsService: ItemsService) { }

  ngOnInit() {
    this.coverUrl = this.coverUrlShown = '/api/items/' + this.item.barcode + '/cover';
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

  public fileOver(e:any):void {
    this.hasDropZoneOver = e;
  }

  deleteCover() {
    console.log('DELETE');
    this.itemsService.deleteCover(this.item).subscribe(
      () => {
        console.log("deleted cover");
        this.handleMissingImage();
      },
      error => {
        console.log(error);
      }
    );
  }

}
