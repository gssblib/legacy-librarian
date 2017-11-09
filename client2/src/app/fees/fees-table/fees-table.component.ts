import { Component, OnInit, ViewChild } from '@angular/core';
import { SortKey } from '../../core/sort-key';
import {
  IPageChangeEvent,
  ITdDataTableColumn,
  ITdDataTableSortChangeEvent,
  TdPagingBarComponent
} from '@covalent/core';
import { Fee, FeesService } from '../fees.service';
import { TableFetchResult } from '../../core/table-fetcher';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ParamsUtil } from '../../core/params-util';

@Component({
  selector: 'gsl-fees-table',
  templateUrl: './fees-table.component.html',
  styleUrls: ['./fees-table.component.css']
})
export class FeesTableComponent implements OnInit {
  /** Current result being shown in the table. */
  result: TableFetchResult<Fee>;

  /** Current criteria for the item search. Set from the URL parameters. */
  criteria: Object = {};

  /** Current page number. Set from the URL and the pagination bar. */
  page: number = 1;

  /** Current page size. Set from the URL and the pagination bar. */
  pageSize: number = 10;

  /** Current sort key. Set from the URL and table sort event. */
  sortKey = new SortKey('fee', 'ASC');

  @ViewChild('pagingBar')
  pagingBar: TdPagingBarComponent;

  /** Meta-data for the fees table. */
  columns: ITdDataTableColumn[] = [
    {name: 'surname', label: 'Borrower Name', sortable: true},
    {name: 'firstname', label: 'First Name', sortable: true},
    {name: 'fee', label: 'Fee', sortable: true},
  ];

  /** Flag set while setting page in paging bar with navigateToPage. */
  private navigating = false;

  private routeSubscription: Subscription;

  constructor(private feesService: FeesService,
              private route: ActivatedRoute,
              private router: Router) {
  }

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

  /**
   * Sets the properties from the route's query parameters.
   */
  private parseParams(params: Params) {
    const p = new ParamsUtil(params);
    this.page = p.getNumber('page', 1);
    this.pageSize = p.getNumber('pageSize', 10);
    this.sortKey = params['order']
      ? SortKey.fromString(params['order'])
      : new SortKey('fee', 'ASC');
    this.criteria = p.getValues([]);
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
      console.log('navigation error', err);
    });
  }

  /**
   * Gets the items from the server.
   */
  private reload() {
    const offset = (this.page - 1) * this.pageSize;
    const criteria = Object.assign(
      {}, this.criteria, {'_order': this.sortKey.toString()});
    this.feesService.getFees(criteria, offset, this.pageSize, true).subscribe(
      result => {
        this.result = result;
      }
    );
  }
 }
