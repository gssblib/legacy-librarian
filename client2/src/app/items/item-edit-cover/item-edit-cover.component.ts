import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from "../../core/config.service";
import { RpcService } from "../../core/rpc.service";
import { NotificationService } from "../../core/notification-service";
import { Item } from "../shared/item";
import { ItemsService } from "../shared/items.service";
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable, of, from, defer } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'gsl-item-edit-cover',
  templateUrl: './item-edit-cover.component.html',
  styleUrls: ['./item-edit-cover.component.css'],
})
export class ItemEditCoverComponent implements OnInit {
  @Input('item') item: Item;

  private ref: AngularFireStorageReference;
  public url: Observable<string | null>;

  constructor(
    private rpc: RpcService,
    private notificationService: NotificationService,
    private itemsService: ItemsService,
    private config: ConfigService,
    private readonly storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.fetchImageRef();
  }

  private fetchImageRef() {
    this.ref = this.storage.ref('covers/' + this.item.barcode + '.jpg');
    this.url = this.ref.getDownloadURL().pipe(
      catchError(() => {
        // return null if image not found.
        return of(null);
      }),
    );
  }

  dropped(files: NgxFileDropEntry[]) {
    if (files.length === 0) {
      console.log('no file is uploaded');
      return;
    }
    const droppedFile = files[0];

    // if it's valid file
    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        const newRef = this.storage.ref('covers/' + this.item.barcode + '.jpg');
        from(newRef.put(file)).pipe(
          take(1),
          tap(() => {
            this.notificationService.show("Upload image successfully");
            this.fetchImageRef();
          }),
          catchError(() => {
            this.notificationService.showError("Fail to upload the image");
            return of(null);
          }),
        ).subscribe();
      });
    }

    return;
  }

  dragFilesDropped(droppedFile: any) {
    console.log("dropped", droppedFile);
  }

  /* Actions */
  deleteCover() {
    this.ref.delete().pipe(
      take(1),
      tap(() => {
        this.fetchImageRef();
        this.notificationService.show("Delete image successfully");
      }),
      catchError((error) => {
        this.notificationService.showError("Failed to delete image");
        return of(null);
      }),
    ).subscribe();
  }
}
