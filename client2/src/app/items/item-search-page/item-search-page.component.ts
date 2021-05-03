import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/notification-service';
import { ItemState } from '../shared/item-state';
import { ItemsService } from '../shared/items.service';
import { merge ,  of,  Observable } from 'rxjs';
import { map, flatMap, catchError } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DataTableParams } from '../../core/data-table-params';

import { Column } from "../../core/form.service";
import { FocusService } from "../../core/focus.service";
import { ItemService } from "../shared/item.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

const SEARCH_FIELDS = [
  'title', 'author', 'category', 'subject', 'state', 'seriestitle', 'age', 'classification',
];

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
  count = -1;
  loading = false;

  /** Wrapper for pagination and sorting. */
  params: DataTableParams;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private focusService: FocusService,
              private notificationService: NotificationService,
              private itemService: ItemService,
              private itemsService: ItemsService,
              private route: ActivatedRoute,
              private router: Router) {
    this.searchFields = this.itemsService.getFormlyFields(
      SEARCH_FIELDS, col => Object.assign(new Column(), col, {required: false}));
  }

  add() {
    this.itemService.newItem = null;
    this.router.navigate(['items', 'add']);
  }

  ngAfterViewInit(): void {
    this.itemService.set(null);
    this.params = new DataTableParams(SEARCH_FIELDS, this.paginator, this.sort);

    // Navigate if pagination or sort order changes.
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => this.navigate());

    // Load new data when route changes.
    this.route.queryParams
      .pipe(
        map(params => { this.criteria = this.params.parseParams(params) }),
        flatMap(() => {
          this.loading = true;
          return Object.keys(this.criteria).length === 0
            ? of(null)
            : this.itemsService.getMany(
              this.params.query(this.criteria), this.params.offset(), this.params.limit(), true);
        }),
        map(result => {
          this.loading = false;
          if (result != null) {
            this.count = result.count;
            return result.rows;
          } else {
            this.count = -1;
            this.focusService.setFocus('search');
            return [];
          }
        }),
        catchError(() => {
          this.loading = false;
          return of([]);
      }))
      .subscribe(data => this.dataSource.data = data);
  }

  search() {
    this.paginator.pageIndex = 0;
    this.navigate();
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
