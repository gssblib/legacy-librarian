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

const SEARCH_FIELDS = ['subject', 'classification'];

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

  displayedColumns = ['barcode', 'title', 'author'];
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
    this.searchFields = this.itemsService.getItemFields(SEARCH_FIELDS).map(
      fields => {
        console.log(fields);
        fields.push({
          key: 'lastCheckoutDate',
          type: 'input',
          templateOptions: {
            placeholder: "Last Checkout Date",
            required: true,
            type: "date"
          },
        });
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
        this.criteria = p.getValues(['subject', 'classification', 'lastCheckoutDate']);
      })
      .flatMap(() => {
        this.loading = true;
        const criteria = Object.assign({}, this.criteria);
        if (criteria.classification === '') {
          delete criteria.classification;
        }
        return this.rpc.httpGet('reports/itemUsage', criteria);
      })
      .catch(() => {
        this.loading = false;
        return observableOf([]);
      })
      .subscribe(result => {
        this.loading = false;
        this.data = result.rows;
        this.count = this.data.length;
        this.dataSource.data = this.data;
      });
  }

  /**
   * Changes the route to the route reflecting the current state of the search.
   */
  private navigate() {
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
