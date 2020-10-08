import { Params } from '@angular/router';
import { ParamsUtil } from './params-util';
import { SortKey } from './sort-key';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

/**
 * Query parameters of a search page with pagination and sorting.
 *
 * This class knows how to construct and parse the query parameters for search pages. It wraps a
 * paginator (`MatPaginator` with its page size and page index) and a sort column (`MatSort`).
 */
export class DataTableParams {

  /**
   * @param fields Names of the fields that may be used in the query.
   * @param paginator Wrapped paginator containing page size and page index
   * @param sort Wrapped sort column containing column name and sort direction
   */
  constructor(private readonly fields: string[],
              private paginator: MatPaginator,
              private sort?: MatSort) {
    // Reset page when sort order is change.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }
  }

  /**
   * Converts the router `params` to a query object and sets the pagination and sort data.
   *
   * The `params` may contain the following pagination and sort data:
   *
   *   page: zero-based index of current page
   *   pageSize: current page size
   *   order: name of the order column, possibly preceded by a - indicating descending order
   *
   * The remaining parameters are the search fields. The returned object includes only these search
   * fields.
   */
  parseParams(params: Params): Object {
    const p = new ParamsUtil(params);
    this.paginator.pageIndex = p.getNumber('page', 0);
    this.paginator.pageSize = p.getNumber('pageSize', 10);

    const order = params['order'];
    if (order && this.sort) {
      const sortKey = SortKey.fromString(order)
      this.sort.active = sortKey.name;
      this.sort.direction = sortKey.order === 'ASC' ? 'asc' : 'desc';
    }
    return p.getValues(this.fields);
  }

  /**
   * Returns the query parameters representing the search criteria together with the current
   * pagination and sort state.
   *
   * This is the inverse of the `parseParams` method. The `criteria` is the object containing the
   * search fields.
   */
  toQueryParams(criteria: Object): Params {
    const params: any = Object.assign({}, criteria, {
      page: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
    });
    if (this.sort) {
      params.order = this.sortOrder();
    }
    return params;
  }

  /**
   * Translates the `sort` to a string containing the sort column name, optionally preceded by a -
   * to indicate descending order.
   */
  static sortOrder(sort: MatSort): string {
    return (sort.direction === 'desc' ? '-' : '') + sort.active;
  }

  /**
   * Return the current sort order as a string.
   */
  sortOrder(): string {
    return this.sort ? DataTableParams.sortOrder(this.sort) : '';
  }

  /**
   * Returns the zero-based offset of the first result on the current page.
   */
  offset() {
    return this.paginator.pageIndex * this.paginator.pageSize;
  }

  limit() {
    return this.paginator.pageSize;
  }

  /**
   * Returns the backend query for the search `criteria` with the current sort order.
   */
  query(criteria): Object {
    return Object.assign({}, criteria, {'_order': this.sortOrder()});
  }
}

