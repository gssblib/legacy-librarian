import {Component, OnInit} from "@angular/core";
import {ItemsService} from "../shared/items.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Item} from "../shared/item";
import {TableFetchResult} from "../../core/table-fetcher";
import {IPageChangeEvent, ITdDataTableColumn, ITdDataTableSortChangeEvent} from "@covalent/core";
import {ParamsUtil} from "../../core/params-util";
import {SortKey} from "../../core/sort-key";

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
export class ItemSearchPageComponent implements OnInit {
  /** Current result being shown in the table. */
  result: TableFetchResult<Item>;

  /** Current criteria for the item search. Set from the URL parameters. */
  criteria: Object = {};

  /** Current page number. Set from the URL and the pagination bar. */
  page: number = 1;

  /** Current page size. Set from the URL and the pagination bar. */
  pageSize: number = 10;

  /** Current sort key. Set from the URL and table sort event. */
  sortKey = new SortKey('title', 'ASC');

  /** Meta-data for the items table. */
  columns: ITdDataTableColumn[] = [
    {name: 'barcode', label: 'Barcode', sortable: true},
    {name: 'title', label: 'Title', sortable: true},
    {name: 'author', label: 'Author', sortable: true},
    {name: 'description', label: 'Description', sortable: true},
  ];

  constructor(private itemsService: ItemsService,
              private route: ActivatedRoute,
              private router: Router) {
    route.queryParams.subscribe(
      params => {
        this.parseParams(params);
        this.reload();
      });
  }

  ngOnInit() {
  }

  onSort(event: ITdDataTableSortChangeEvent) {
    this.sortKey = SortKey.fromChange(event);
    this.navigate();
  }

  onPage(event: IPageChangeEvent) {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.navigate();
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
    this.sortKey = SortKey.fromString(params['order']);
    p.mergeInto(this.criteria, ['title', 'author']);
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
    })
  }

  /**
   * Gets the items from the server.
   */
  private reload() {
    const offset = (this.page - 1) * this.pageSize;
    const criteria = Object.assign(
      {}, this.criteria, {'_order': this.sortKey.toString()});
    this.itemsService.getItems(criteria, offset, this.pageSize, true).subscribe(
      result => {
        this.result = result;
      }
    );
  }
}
