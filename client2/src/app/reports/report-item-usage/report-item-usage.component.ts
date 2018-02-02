import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { RpcService } from '../../core/rpc.service';
import { ItemsService } from '../../items/shared/items.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { of as observableOf } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/notification-service';
import { Observable } from 'rxjs/Observable';
import { ParamsUtil } from '../../core/params-util';
import { TableFetchResult } from '../../core/table-fetcher';
import { FormlyFields } from '../../core/form.service';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private rpc: RpcService,
              private notificationService: NotificationService,
              private itemsService: ItemsService,
              private route: ActivatedRoute,
              private router: Router) {
    this.searchFields = this.itemsService.getFormlyFields(SEARCH_FIELDS).map(
      fields => {
        fields.push(FormlyFields.date('lastCheckoutDate', 'Last Checkout Date', true));
        return fields;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Load new data when route changes.
    this.route.queryParams
      .map(params => {
        const p = new ParamsUtil(params);
        this.criteria = p.getValues(SEARCH_FIELDS.concat(['lastCheckoutDate']));
      })
      .flatMap(() => {
        const criteria = this.normalizeCriteria(Object.assign({}, this.criteria));
        if (!this.criteria.lastCheckoutDate) {
          return observableOf(TableFetchResult.EMPTY);
        }
        this.loading = true;
        return this.rpc.httpGet('reports/itemUsage', criteria);
      })
      .catch(err => {
        this.notificationService.showError('error loading report', err);
        this.loading = false;
        return observableOf(TableFetchResult.EMPTY);
      })
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

  downloadCsv() {
    new Angular2Csv(
      this.data, 'item_usage_report.csv',
      {
        showTitle: true,
        showLabels: true,
        title: 'Item Usage Report',
      }
    );
  }
}
