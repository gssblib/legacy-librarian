import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from '../../items/shared/items.service';
import { ItemState } from '../../items/shared/item-state';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, mergeMap, switchMap } from "rxjs/operators";
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DataTableParams } from '../../core/data-table-params';
import { NotificationService } from '../../core/notification-service';
import { MatPaginator } from "@angular/material/paginator";
import { Item } from "../../items/shared/item";
import { AuthenticationService, User } from "../../core/auth.service";
import { BorrowersService } from "../../borrowers/shared/borrowers.service";

const SEARCH_FIELDS = ['title', 'seriestitle', 'author', 'subject', 'category', 'age'];

@Component({
  selector: 'gsl-item-browser-page',
  templateUrl: './item-browser-page.component.html',
  styleUrls: ['./item-browser-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemBrowserPageComponent implements AfterViewInit {

  extraCriteria: Object = {'state': 'CIRCULATING'}
  ItemState = ItemState;

  items: Item[] = [];

  /** Formly config for the search form. */
  searchFields: Observable<FormlyFieldConfig[]>;

  /** Model of the search form. */
  criteria = {};

  count = 0;
  loading = false;

  /** Wrapper for pagination and sorting. */
  params: DataTableParams;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private readonly notificationService: NotificationService,
              private readonly itemsService: ItemsService,
              private readonly borrowersService: BorrowersService,
              private readonly authenticationService: AuthenticationService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
    this.searchFields = this.itemsService.getFormlyFields(SEARCH_FIELDS);
  }

  ngAfterViewInit(): void {
    this.params = new DataTableParams(SEARCH_FIELDS, this.paginator, null);

    // Navigate if pagination or sort order changes.
    this.paginator.page.subscribe(() => this.navigate());

    // Load new data when route changes.
    this.route.queryParams
      .pipe(
        map(params => {
          this.criteria = this.params.parseParams(params);
        }),
      )
      .subscribe(() => {
        this.refreshItems();
      });
  }

  private refreshItems(): void {
    this.fetchItems()
      .subscribe(data => {
        this.items = data;
        this.changeDetectorRef.markForCheck();
      });
  }

  private fetchItems(): Observable<Item[]> {
    this.loading = true;
    const criteria = {...this.criteria, ...this.extraCriteria};
    const params = this.params;
    const query = params.query(criteria);
    return this.itemsService.getMany(query, params.offset(), params.limit(), true)
      .pipe(
        map(result => {
          this.count = result.count;
          return result.rows;
        }),
        catchError(() => {
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        }));
  }

  order(item: Item): void {
    const user: User = this.authenticationService.getUser();
    this.borrowersService.orderItem(item.barcode, Number(user.id)).subscribe(
      () => {
        this.notificationService.show('Item ordered');
        this.refreshItems();
      },
      (err) => {
        this.notificationService.showError('Couldn\'t order item');
      }
    );
  }

  /**
   * Changes the route to the route reflecting the current state of the search.
   */
  navigate() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params.toQueryParams(this.criteria),
    }).catch(err => {
      this.notificationService.showError('navigation error', err);
    });
  }
}
