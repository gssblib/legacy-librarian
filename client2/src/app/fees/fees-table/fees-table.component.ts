import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NotificationService } from '../../core/notification-service';
import { Fee, FeesService } from '../fees.service';
import { TableFetchResult } from '../../core/table-fetcher';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataTableParams } from '../../core/data-table-params';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'gsl-fees-table',
  templateUrl: './fees-table.component.html',
  styleUrls: ['./fees-table.component.css']
})
export class FeesTableComponent implements AfterViewInit {
  /** Current result being shown in the table. */
  result: TableFetchResult<Fee>;

  displayedColumns = ['surname', 'firstname', 'fee'];
  dataSource = new MatTableDataSource();
  count = 0;
  loading = false;

  /** Wrapper for pagination and sorting. */
  params: DataTableParams;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private notificationService: NotificationService,
              private feesService: FeesService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngAfterViewInit(): void {
    this.params = new DataTableParams([], this.paginator, this.sort);

    // Navigate if pagination or sort order changes.
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => this.navigate());

    // Load new data when route changes.
    this.route.queryParams
      .map(params => { this.params.parseParams(params) })
      .flatMap(() => {
        this.loading = true;
        return this.feesService.getFees(
          this.params.query({}), this.params.offset(), this.params.limit(), true);
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
  private navigate() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params.toQueryParams({}),
    }).catch(err => {
      this.notificationService.showError('navigation error', err);
    });
  }
 }
