import {Observable} from "rxjs";

/**
 * Specifies which page of a table-like result to fetch.
 */
export class TablePageRequest {
  /**
   * @param offset Zero-based offset of the first item to return
   * @param limit Maximal number of items to return
   * @param sortOrder Name of the property to sort by
   */
  constructor(readonly offset: number,
              readonly limit: number,
              readonly sortOrder: string) {
  }
}

/**
 * Data of a page of some table-like set.
 */
export class TableFetchResult<T> {
  static EMPTY = new TableFetchResult([], 0);

  constructor(readonly rows: T[], readonly count: number) {
  }
}

/**
 * Function interface for fetching pages of some table-like set.
 */
export interface TablePageFetcher<T> {
  (pageRequest: TablePageRequest): Observable<TableFetchResult<T>>;
}
