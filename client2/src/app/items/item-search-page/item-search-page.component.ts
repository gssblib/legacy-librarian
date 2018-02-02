import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/notification-service';
import { ItemState } from '../shared/item-state';
import { ItemsService } from '../shared/items.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DataTableParams } from '../../core/data-table-params';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

const SEARCH_FIELDS = ['title', 'author', 'category', 'subject', 'state', 'seriestitle'];

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
export class ItemSearchPageComponent implements AfterViewInit {
  ItemState = ItemState;

  /** Formly config for the search form. */
  searchFields: Observable<FormlyFieldConfig[]>;

  /** Model of the search form. */
  criteria = {};

  /** Additional criteria to apply before the search is executed. */
  extraCriteria: Object = {};

  displayedColumns = ['barcode', 'status', 'title', 'author', 'subject', 'category'];
  dataSource = new MatTableDataSource();
  count = 0;
  loading = false;

  /** Wrapper for pagination and sorting. */
  params: DataTableParams;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private notificationService: NotificationService,
              private itemsService: ItemsService,
              private route: ActivatedRoute,
              private router: Router) {
    this.searchFields = this.itemsService.getFormlyFields(SEARCH_FIELDS);
  }

  ngAfterViewInit(): void {
    this.params = new DataTableParams(SEARCH_FIELDS, this.paginator, this.sort);

    // Navigate if pagination or sort order changes.
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => this.navigate());

    // Load new data when route changes.
    this.route.queryParams
      .map(params => { this.criteria = this.params.parseParams(params) })
      .flatMap(() => {
        this.loading = true;
        const criteria = Object.assign({}, this.criteria, this.extraCriteria);
        return this.itemsService.getMany(this.params.query(criteria), this.params.offset(), this.params.limit(), true);
      })
      .map(result => {
        this.loading = false;
        this.count = result.count;
        return result.rows;
      })
      .catch(() => {
        this.loading = false;
        return observableOf([]);
      })
      .subscribe(data => this.dataSource.data = data);
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
