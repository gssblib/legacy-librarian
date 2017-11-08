import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { ItemsService } from "../shared/items.service";
import { FileUploader } from 'ng2-file-upload';


class CoverUploader extends FileUploader {
  form;

  public onSuccessItem(item:any, response:any, status:any, headers:any):any {
    // Force image reload.
    this.form.coverUrlShown = this.form.coverUrl + '?random=' + Math.random());
    this.form.hasCover = true;
    return {item, response, status, headers};
  }
}

@Component({
  selector: "gsl-item-edit-form",
  templateUrl: "./item-edit-form.component.html",
  styleUrls: ["./item-edit-form.component.css"],
  inputs: ['item'],
})
export class ItemEditFormComponent implements OnInit {
  form = new FormGroup({});
  item = null;
  hasCover:boolean = true;
  fields: Array<FormlyFieldConfig> = [];
  coverUrl:string;

  public uploader:CoverUploader;
  public hasDropZoneOver:boolean = false;

  constructor(private itemsService: ItemsService) {}

  ngOnInit(): void {
    this.itemsService.getItemFields().subscribe(fields => this.fields = fields);
    this.coverUrl = this.coverUrlShown = '/api/items/' + this.item.barcode + '/cover';
    this.uploader = new CoverUploader({
      url: this.coverUrl,
      isHTML5: true,
      disableMultipart: false,
      removeAfterUpload: true,
      autoUpload: true,
    });
    this.uploader.form = this;
  }

  submit(item) {
    this.itemsService.saveItem(this.item).subscribe(
      value => { console.log("saved item"); },
      error => { console.log("error saving item: " + error)}
    );
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
