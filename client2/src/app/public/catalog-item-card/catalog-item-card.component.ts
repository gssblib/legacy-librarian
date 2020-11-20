import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Item } from "../../items/shared/item";
import { ConfigService } from "../../core/config.service";
import { Availability } from "../../items/shared/item-status";
import { NotificationService } from "../../core/notification-service";
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

/**
 * Component showing a single item in the online catalog.
 *
 * This component shows the details of the item (title, author, barcode, and so forth), its status,
 * and, if the item is available, the order button.
 */
@Component({
  selector: 'gsl-catalog-item-card',
  templateUrl: './catalog-item-card.component.html',
  styleUrls: ['./catalog-item-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogItemCardComponent {
  @Input() item: Item;
  @Input() showOrderButton = false;
  @Output() orderItem = new EventEmitter<Item>();

  url?: Observable<string|null>;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly notificationService: NotificationService,
              private readonly config: ConfigService,
              private readonly storage: AngularFireStorage) {}

  ngOnInit() {
    const ref = this.storage.ref('covers/' + this.item.barcode + '.jpg');
    this.url = ref.getDownloadURL();
  }

  available(item: Item): boolean {
    return item.availability === Availability.AVAILABLE;
  }

  order(item: Item): void {
    this.orderItem.emit(item);
  }
}
