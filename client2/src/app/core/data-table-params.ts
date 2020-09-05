import { Params } from '@angular/router';
import { ParamsUtil } from './params-util';
import { SortKey } from './sort-key';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

export class DataTableParams {

  constructor(private fields: string[], private paginator: MatPaginator, private sort?: MatSort) {
    // Reset page when sort order is change.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }
  }

  parseParams(params: Params): Object {
    const p = new ParamsUtil(params);
    this.paginator.pageIndex = p.getNumber('page', 0);
    this.paginator.pageSize = p.getNumber('pageSize', 10);
    if (params['order'] && this.sort) {
      const sortKey = SortKey.fromString(params['order'])
      this.sort.active = sortKey.name;
      this.sort.direction = sortKey.order === 'ASC' ? 'asc' : 'desc';
    }
    return p.getValues(this.fields);
  }

  static sortOrder(sort: MatSort): string {
    return (sort.direction === 'desc' ? '-' : '') + sort.active;
  }

  sortOrder(): string {
    return this.sort ? DataTableParams.sortOrder(this.sort) : '';
  }

  offset() {
    return this.paginator.pageIndex * this.paginator.pageSize;
  }

  limit() {
    return this.paginator.pageSize;
  }

  query(criteria): Object {
    return Object.assign({}, criteria, {'_order': this.sortOrder()});
  }

  /**
   * Returns the query parameters representing the current state.
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
}

