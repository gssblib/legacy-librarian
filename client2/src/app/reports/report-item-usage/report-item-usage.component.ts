import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RpcService } from '../../core/rpc.service';
import { ItemsService } from '../../items/shared/items.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/notification-service';
import { ParamsUtil } from '../../core/params-util';
import { TableFetchResult } from '../../core/table-fetcher';
import { FormlyFields } from '../../core/form.service';
import * as FileSaver from "file-saver";

const SEARCH_FIELDS = ['subject', 'classification', 'category'];

@Component({
  selector: 'gsl-report-item-usage',
  templateUrl: './report-item-usage.component.html',
  styleUrls: ['./report-item-usage.component.css']
})
export class ReportItemUsageComponent implements AfterViewInit {
  /** Formly config for the search form. */
  searchFields: Observable<FormlyFieldConfig[]>;

  /** Model of the search form. */
  criteria: any = {};

  displayedColumns = ['barcode', 'title', 'author', 'category', 'last_checkout_date'];
  data = [];
  dataSource = new MatTableDataSource([]);
  count = 0;
  loading = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private rpc: RpcService,
              private notificationService: NotificationService,
              private itemsService: ItemsService,
              private route: ActivatedRoute,
              private router: Router) {
    this.searchFields = this.itemsService.getFormlyFields(SEARCH_FIELDS).pipe(map(
      fields => {
        fields.push(FormlyFields.date('lastCheckoutDate', 'Last Checkout Date', true));
        return fields;
      }));
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Load new data when route changes.
    this.route.queryParams
      .pipe(
        map(params => {
          const p = new ParamsUtil(params);
          this.criteria = p.getValues(SEARCH_FIELDS.concat(['lastCheckoutDate']));
        }),
        flatMap(() => {
          const criteria = this.normalizeCriteria(Object.assign({}, this.criteria));
          if (!this.criteria.lastCheckoutDate) {
            return of(TableFetchResult.EMPTY);
          }
          this.loading = true;
          return this.rpc.httpGet('reports/itemUsage', criteria);
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
        this.dataSource.data = this.data;
      });
  }

  normalizeCriteria(criteria: any) {
    if (criteria.lastCheckoutDate === '') {
      delete criteria.lastCheckoutDate;
    }
    if (criteria.classification === '') {
      delete criteria.classification;
    }
    return criteria;
  }

  /**
   * Changes the route to the route reflecting the current state of the search.
   */
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

  private toCsvRow(row: any): string {
    return `${row.barcode},${row.title},${row.author},${row.category},${row.last_checkout_date}`;
  }
}
