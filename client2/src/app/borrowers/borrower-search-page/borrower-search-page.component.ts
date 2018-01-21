import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BorrowersService } from '../shared/borrowers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/notification-service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { DataTableParams } from '../../core/data-table-params';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { FormlyFieldConfig } from '@ngx-formly/core';

const SEARCH_FIELDS = ['surname', 'firstname', 'emailaddress', 'state'];

/**
 * Borrower search page with search form and result table.
 *
 * All parameters (search, paging, sorting) are reflected in the route's URL
 * params. The component reloads the borrowers whenever the route changes.
 */
@Component({
  selector: 'gsl-borrower-search-page',
  templateUrl: './borrower-search-page.component.html',
  styleUrls: ['./borrower-search-page.component.css']
})
export class BorrowerSearchPageComponent implements AfterViewInit {
  /** Formly config for the search form. */
  searchFields: Observable<FormlyFieldConfig[]>;

  /** Model of the search form. */
  criteria = {};

  /** Data table. */
  displayedColumns = ['surname', 'firstname', 'state', 'emailaddress', 'contactname'];
  dataSource = new MatTableDataSource();
  count = 0;
  loading = false;

  /** Wrapper for pagination and sorting. */
  params: DataTableParams;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private notificationService: NotificationService,
              private borrowersService: BorrowersService,
              private route: ActivatedRoute,
              private router: Router) {
    this.searchFields = this.borrowersService.getBorrowerFields(SEARCH_FIELDS);
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
        return this.borrowersService.getBorrowers(
          this.params.query(this.criteria), this.params.offset(), this.params.limit(), true);
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
