import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NotificationService } from "../../core/notification-service";
import { Item } from "../shared/item";
import { TableFetchResult } from "../../core/table-fetcher";
import {
  IPageChangeEvent, ITdDataTableColumn, ITdDataTableSortChangeEvent,
  TdPagingBarComponent
} from "@covalent/core";
import { ParamsUtil } from "../../core/params-util";
import { SortKey } from "../../core/sort-key";
import { Subscription } from "rxjs/Subscription";
import { ItemState } from "../shared/item-state";
import { ItemsService } from "../shared/items.service";

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
export class ItemSearchPageComponent implements OnInit, OnDestroy {
  ItemState = ItemState;

  searchFields: string[] = ['title', 'author', 'category', 'subject', 'state'];

  /** Current result being shown in the table. */
  result: TableFetchResult<Item>;

  /** Current criteria for the item search. Set from the URL parameters. */
  criteria: Object = {};

  /** Additional criteria to apply before the search is executed. */
  extraCriteria: Object = {};

  /** Current page number. Set from the URL and the pagination bar. */
  page: number = 1;

  /** Current page size. Set from the URL and the pagination bar. */
  pageSize: number = 10;

  /** Current sort key. Set from the URL and table sort event. */
  sortKey = new SortKey('title', 'ASC');

  @ViewChild('pagingBar')
  pagingBar: TdPagingBarComponent;

  /** Meta-data for the items table. */
  columns: ITdDataTableColumn[] = [
    {name: 'barcode', label: 'Barcode', width: 100, sortable: true},
    {name: 'status', label: 'Status', width: 140, sortable: false, format: value => ItemState[value]},
    {name: 'title', label: 'Title', sortable: true},
    {name: 'author', label: 'Author', width: 220, sortable: true},
    {name: 'subject', label: 'Subject', width: 180, sortable: true},
    {name: 'category', label: 'Category', width: 100, sortable: true},
  ];

  /** Flag set while setting page in paging bar with navigateToPage. */
  private navigating = false;

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
    // TdPagingBar's `page` property is read-only. It can only be changed by calling
    // the navigateToPage method. We do that if the page differs, but temporarily set
    // the `navigating` flag to that the page change event triggered by navigateToPage
    // does not cause another navigation.
    if (this.pagingBar && this.pagingBar.page !== this.page) {
      this.navigating = true;
      this.pagingBar.navigateToPage(this.page);
    }
    this.reload();
  }

  onSort(event: ITdDataTableSortChangeEvent) {
    this.sortKey = SortKey.fromChange(event);
    this.navigate();
  }

  onPage(event: IPageChangeEvent) {
    if (this.navigating) {
      this.navigating = false;
    } else {
      this.page = event.page;
      this.pageSize = event.pageSize;
      this.navigate();
    }
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
    this.page = p.getNumber('page', 1);
    this.pageSize = p.getNumber('pageSize', 10);
    this.sortKey = params['order']
      ? SortKey.fromString(params['order'])
      : new SortKey('title', 'ASC');
    this.criteria = p.getValues(this.searchFields);
  }

  /**
   * Returns the query parameters representing the current state.
   */
  private toQueryParams(): Params {
    return Object.assign({}, this.criteria, {
      page: this.page,
      pageSize: this.pageSize,
      order: this.sortKey.toString(),
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

  /**
   * Gets the items from the server.
   */
  private reload() {
    const offset = (this.page - 1) * this.pageSize;
    const criteria = Object.assign(
      {}, this.criteria, this.extraCriteria, {'_order': this.sortKey.toString()});
    this.itemsService.getItems(criteria, offset, this.pageSize, true).subscribe(
      result => {
        this.result = result;
      }
    );
  }
}
