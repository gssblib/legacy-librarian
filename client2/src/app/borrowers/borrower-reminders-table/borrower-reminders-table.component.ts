import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BorrowersService } from '../shared/borrowers.service';
import { BorrowerService } from '../shared/borrower.service';
import { Borrower, BorrowerEmail } from '../shared/borrower';
import { merge, of, Subject } from 'rxjs';
import { catchError, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableParams } from '../../core/data-table-params';

@Component({
  selector: 'gsl-borrower-reminders-table',
  templateUrl: './borrower-reminders-table.component.html',
  styleUrls: ['./borrower-reminders-table.component.css']
})
export class BorrowerRemindersTableComponent implements OnInit, OnDestroy {
  readonly destroyed = new Subject<void>();

  borrower: Borrower;

  readonly displayedColumns = ['sendTime', 'recipient', 'emailText'];
  readonly dataSource = new MatTableDataSource<BorrowerEmail>();

  /** Wrapper for pagination and sorting. */
  params: DataTableParams;

  /** Search criteria (not used yet). */
  criteria = {};

  loading = false;
  count = 0;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private readonly borrowersService: BorrowersService,
    private readonly borrowerService: BorrowerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.borrowerService.modelObservable
      .pipe(takeUntil(this.destroyed))
      .subscribe(borrower => {
        this.borrower = borrower;
      });
  }

  sortOrder(sort: MatSort): string {
    return (sort.direction === 'desc' ? '-' : '') + sort.active;
  }

  firstLine(text: string): string {
    const newline = text.indexOf('\n');
    return text.substring(0, newline);
  }

  rest(text: string): string {
    const newline = text.indexOf('\n');
    return text.substring(newline + 1);
  }

  ngOnInit(): void {
    this.borrower = this.borrowerService.get();
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngAfterViewInit(): void {
    this.params = new DataTableParams([], this.paginator, this.sort);

    // Navigate if pagination or sort order changes.
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => this.navigate());

    // Load new data when route changes.
    this.route.queryParams
      .pipe(
        tap(params => {
          this.criteria = this.params.parseParams(params);
        }),
        switchMap(() => {
          this.loading = true;
          const params = this.params.toServerParams({});
          return this.borrowersService.getBorrowerReminders(this.borrower.borrowernumber, params);
        }),
        map(result => {
          this.count = result.count;
          return result.rows ?? [];
        }),
        catchError((error) => {
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        }),
      ).subscribe(data => this.dataSource.data = data);
  }

  /**
   * Changes the route to the route reflecting the current state of the search.
   */
  navigate() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params.toQueryParams({}),
    }).then();
  }
}
