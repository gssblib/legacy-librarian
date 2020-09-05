import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from '../../items/shared/items.service';
import { ItemState } from '../../items/shared/item-state';
import { Observable ,  of } from 'rxjs';
import { map, flatMap, catchError } from "rxjs/operators";
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DataTableParams } from '../../core/data-table-params';
import { MatPaginator } from '@angular/material';
import { NotificationService } from '../../core/notification-service';

const SEARCH_FIELDS = ['title', 'seriestitle', 'author', 'category', 'age'];

@Component({
  selector: 'gsl-item-browser-page',
  templateUrl: './item-browser-page.component.html',
  styleUrls: ['./item-browser-page.component.css']
})
export class ItemBrowserPageComponent implements AfterViewInit {

  extraCriteria: Object = {'state': 'CIRCULATING'}
  ItemState = ItemState;

  items = [];

  /** Formly config for the search form. */
  searchFields: Observable<FormlyFieldConfig[]>;

  /** Model of the search form. */
  criteria = {};

  count = 0;
  loading = false;

  /** Wrapper for pagination and sorting. */
  params: DataTableParams;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private notificationService: NotificationService,
              private itemsService: ItemsService,
              private route: ActivatedRoute,
              private router: Router) {
    this.searchFields = this.itemsService.getFormlyFields(SEARCH_FIELDS);
  }

  ngAfterViewInit(): void {
    this.params = new DataTableParams(SEARCH_FIELDS, this.paginator, null);

    // Navigate if pagination or sort order changes.
    this.paginator.page.subscribe(() => this.navigate());

    // Load new data when route changes.
    this.route.queryParams
      .pipe(
        map(params => { this.criteria = this.params.parseParams(params) }),
        flatMap(() => {
          this.loading = true;
          const criteria = Object.assign({}, this.criteria, this.extraCriteria);
          return this.itemsService.getMany(this.params.query(criteria), this.params.offset(), this.params.limit(), true);
        }),
        map(result => {
          this.loading = false;
          this.count = result.count;
          return result.rows;
        }),
        catchError(() => {
          this.loading = false;
          return of([]);
        }))
      .subscribe(data => this.items = data);
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
