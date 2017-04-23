import {Observable} from "rxjs";
/**
 * Request for a subset of some list.
 */
export class TableFetchQuery {
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

export class TableFetchResult<T> {
  constructor(readonly rows: T[], readonly count: number) {
  }
}

export interface TableFetcher<T> {
  fetch(query: TableFetchQuery): Observable<TableFetchResult<T>>;
}
