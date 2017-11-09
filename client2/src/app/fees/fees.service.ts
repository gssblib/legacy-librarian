import { Injectable } from "@angular/core";
import { DatePipe } from '@angular/common'
import { RpcService } from "../core/rpc.service";
import { Observable } from 'rxjs/Observable';
import { TableFetchResult } from '../core/table-fetcher';
import { FetchResult } from '../core/fetch-result';

export class Fee {
  surname: string;
  fee: number;
  newFee: number;
  oldFee: number;
}

/**
 * Service for fetching and updating fees.
 */
@Injectable()
export class FeesService {

  constructor(private rpc: RpcService,
              private datePipe: DatePipe) {}

  getFees(criteria, offset, limit, returnCount): Observable<TableFetchResult<Fee>> {
    return this.rpc.fetch('/fees', criteria, offset, limit, returnCount)
      .map(this.fetchResultToFeeResult.bind(this));
  }

  fetchResultToFeeResult(result: FetchResult): TableFetchResult<Fee> {
    return new TableFetchResult(this.rowsToFees(result.rows), result.count);
  }

  rowToFee(row: Object): Fee {
    return Object.assign(new Fee(), row);
  }

  rowsToFees(rows: Object[]): Fee[] {
    console.log('rows: ', rows);
    return rows.map(this.rowToFee);
  }

  updateFees(date) {
    var dateStr = this.datePipe.transform(date, 'yyyy-MM-dd');
    return this.rpc.httpPost('/checkouts/updateFees', {date: dateStr});
  }
}
