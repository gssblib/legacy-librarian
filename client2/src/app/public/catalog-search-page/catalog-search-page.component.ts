import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy, OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from '../../items/shared/items.service';
import { ItemState } from '../../items/shared/item-state';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, takeUntil } from "rxjs/operators";
import { DataTableParams } from '../../core/data-table-params';
import { NotificationService } from '../../core/notification-service';
import { MatPaginator } from "@angular/material/paginator";
import { Item } from "../../items/shared/item";
import { AuthenticationService, User } from "../../core/auth.service";
import { BorrowersService } from "../../borrowers/shared/borrowers.service";
import { OrderCyclesService } from "../../orders/shared/order-cycles.service";
import { OrderCycle, OrderCycleState } from "../../orders/shared/order-cycle";
import { DateService } from "../../core/date-service";

const SEARCH_FIELDS = ['title', 'seriestitle', 'author', 'subject', 'category', 'age'];

/**
 * Search page of the online catalog.
 *
 * This page shows the search form fields and the result table.
 */
@Component({
  selector: 'gsl-catalog-search-page',
  templateUrl: './catalog-search-page.component.html',
  styleUrls: ['./catalog-search-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogSearchPageComponent implements AfterViewInit, OnInit, OnDestroy {
  private readonly destroyed = new Subject<void>();

  /** Search criteria that are automatically added to every query. */
  extraCriteria: Object = {'state': 'CIRCULATING'}

  readonly ItemState = ItemState;

  /** Items shown in the results table. */
  items: Item[] = [];

  /**
   * Order cycles received from the server.
   *
   * We need the order cycles to determine if one currently order items, and to show the start of
   * the next order cycle.
   */
  orderCycles: OrderCycle[] = [];

  openOrderCycle?: OrderCycle;
  scheduledOrderCycle?: OrderCycle;

  nextOrderCycle?: OrderCycle;

  /** Formly config for the search form. */
  readonly searchFields$ = this.itemsService.getFormlyFields(SEARCH_FIELDS, column => ({
    ...column,
    required: false,
  }));

  /** Model of the search form. */
  criteria = {};

  count = 0;
  loading = false;

  /** Wrapper for pagination and sorting. */
  params: DataTableParams;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private readonly notificationService: NotificationService,
              private readonly itemsService: ItemsService,
              private readonly borrowersService: BorrowersService,
              private readonly orderCyclesService: OrderCyclesService,
              private readonly authenticationService: AuthenticationService,
              private readonly dateService: DateService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.orderCyclesService.getPresentAndFutureCycles().subscribe(orderCycles => {
      this.setOrderCycles(orderCycles);
    });
  }

  private setOrderCycles(orderCycles: OrderCycle[]): void {
    this.orderCycles = orderCycles;
    this.changeDetectorRef.markForCheck();
    this.openOrderCycle = this.getOrderCycle(OrderCycleState.OPEN);
    this.scheduledOrderCycle = this.getOrderCycle(OrderCycleState.SCHEDULED);
  }

  private getOrderCycle(state: OrderCycleState): OrderCycle | undefined {
    const now = this.dateService.now();
    return this.orderCycles.find(orderCycle => orderCycle.getState(now) === state);
  }

  ngAfterViewInit(): void {
    this.params = new DataTableParams(SEARCH_FIELDS, this.paginator, null);

    // Navigate if pagination or sort order changes.
    this.paginator.page
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.navigateToCurrentPage());

    // Load new data when route changes.
    this.route.queryParams
      .pipe(
        takeUntil(this.destroyed),
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
   * Navigate to the first search result page for the given search `criteria`.
   */
  search(criteria: object): void {
    this.navigate(criteria);
  }

  /**
   * Navigates to the search result page specified in the paginator.
   */
  private navigateToCurrentPage() {
    this.navigate(this.params.toQueryParams(this.criteria));
  }

  /**
   * Changes the route to the route reflecting the current state of the search.
   */
  private navigate(queryParams: object) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    }).catch(err => {
      this.notificationService.showError('navigation error', err);
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }
}
