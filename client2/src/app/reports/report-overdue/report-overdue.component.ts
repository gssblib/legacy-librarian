import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormlyFields } from '../../core/form.service';
import { of } from 'rxjs';
import { catchError, flatMap, map } from "rxjs/operators";
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/notification-service';
import { RpcService } from '../../core/rpc.service';
import { ParamsUtil } from '../../core/params-util';
import { TableFetchResult } from '../../core/table-fetcher';
import { Borrower } from '../../borrowers/shared/borrower';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'gsl-report-overdue',
  templateUrl: './report-overdue.component.html',
  styleUrls: ['./report-overdue.component.css']
})
export class ReportOverdueComponent implements AfterViewInit {
  /** Formly config for the search form. */
  searchFields = of([FormlyFields.date('last_checkout_date', 'Last Checkout Date')]);

  /** Model of the search form. */
  criteria: any = {};

  displayedColumns = ['surname', 'count'];
  data = [];
  dataSource = new MatTableDataSource([]);
  count = 0;
  loading = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private rpc: RpcService,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Load new data when route changes.
    this.route.queryParams
      .pipe(
        map(params => {
          const p = new ParamsUtil(params);
          this.criteria = p.getValues(['last_checkout_date']);
        }),
        flatMap(() => {
          const criteria = this.normalizeCriteria(Object.assign({}, this.criteria));
          if (!this.criteria.last_checkout_date) {
            return of(TableFetchResult.EMPTY);
          }
          this.loading = true;
          return this.rpc.httpGet('reports/overdue', criteria);
        }),
        catchError(err => {
          this.notificationService.showError('error loading report', err);
          this.loading = false;
          return of(TableFetchResult.EMPTY);
        }))
      .subscribe(result => {
        this.loading = false;
        this.data = result.rows;
        this.count = this.data.length;
        this.dataSource.data = this.data.map(row => Object.assign(new Borrower(), row));
      });
  }

  normalizeCriteria(criteria: any) {
    if (criteria.last_checkout_date === '') {
      delete criteria.last_checkout_date;
    }
    return criteria;
  }

  navigate() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.criteria,
    }).catch(err => {
      this.notificationService.showError('navigation error', err);
    });
  }

  saveAsCsv() {
    const data = this.data.map(borrower => this.toCsvRow(borrower)).join('\n');
    const blob = new Blob([data], {type: 'text/csv'});
    FileSaver.saveAs(blob, "report.csv");
  }

  private toCsvRow(borrower: any): string {
    return `${borrower.borrowernumber},${borrower.surname},${borrower.count}`;
  }
}
