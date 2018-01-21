import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationService } from '../../core/notification-service';
import { Item } from '../shared/item';
import { TableFetchResult } from '../../core/table-fetcher';
import { ParamsUtil } from '../../core/params-util';
import { SortKey } from '../../core/sort-key';
import { Subscription } from 'rxjs/Subscription';
import { ItemState } from '../shared/item-state';
import { ItemsService } from '../shared/items.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { merge } from 'rxjs/observable/merge';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs/observable/of';

/**
 * Item search page with search form and result table.
 *
 * All parameters (search, paging, sorting) are reflected in the route's URL
 * params. The component reloads the items whenever the route changes.
 */
@Component({
  selector: 'gsl-item-search-page',
  templateUrl: './item-search-page.component.html',
  styleUrls: ['./item-search-page.component.css']
})
export class ItemSearchPageComponent implements OnInit, AfterViewInit, OnDestroy {
  ItemState = ItemState;

  searchFields: string[] = ['title', 'author', 'category', 'subject', 'state', 'seriestitle'];

  /** Current result being shown in the table. */
  result: TableFetchResult<Item>;

  /** Current criteria for the item search. Set from the URL parameters. */
  criteria: Object = {};

  /** Additional criteria to apply before the search is executed. */
  extraCriteria: Object = {};

  displayedColumns = ['barcode', 'status', 'title', 'author', 'subject', 'category'];
  dataSource = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private routeSubscription: Subscription;

  constructor(
    private notificationService: NotificationService,
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.routeSubscription =
      this.route.queryParams.subscribe(this.onQueryParamsChanged.bind(this));
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  onQueryParamsChanged(params: Params) {
    this.parseParams(params);
  }

  sortOrder(sort: MatSort): string {
    return (sort.direction === 'desc' ? '-' : '') + sort.active;
  }

  ngAfterViewInit(): void {
    // Reset page when sort order is change.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // Reload data When sort order or page changes.
    merge(this.sort.sortChange, this.paginator.page, this.route.queryParams)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const offset = this.paginator.pageIndex * this.paginator.pageSize;
          const criteria = Object.assign(
            {}, this.criteria, this.extraCriteria, {'_order': this.sortOrder(this.sort)});
          return this.itemsService.getItems(criteria, offset, this.paginator.pageSize, true);
        }),
        map(result => {
          this.isLoadingResults = false;
          this.resultsLength = result.count;
          return result.rows;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
  }

  onSearch(event) {
    this.criteria = event;
    this.navigate();
  }

  public getSearchFields() {
    return this.itemsService.getItemFields(this.searchFields)
  }

  /**
   * Sets the properties from the route's query parameters.
   */
  private parseParams(params: Params) {
    const p = new ParamsUtil(params);
    this.paginator.pageIndex = p.getNumber('page', 1);
    this.paginator.pageSize = p.getNumber('pageSize', 10);
    const sortKey = params['order']
      ? SortKey.fromString(params['order'])
      : new SortKey('title', 'ASC');
    this.sort.active = sortKey.name;
    this.sort.direction = sortKey.order === 'ASC' ? 'asc' : 'desc';
    this.criteria = p.getValues(this.searchFields);
  }

  /**
   * Returns the query parameters representing the current state.
   */
  private toQueryParams(): Params {
    return Object.assign({}, this.criteria, {
      page: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      order: this.sortOrder(this.sort),
    });
  }

  /**
   * Changes the route to the route reflecting the current state of the search.
   */
  private navigate() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.toQueryParams(),
    }).catch(err => {
      this.notificationService.showError('navigation error', err);
    });
  }
}
