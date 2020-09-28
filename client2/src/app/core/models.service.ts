import { RpcService } from "./rpc.service";
import { Column, FormService, ViewFormField } from "./form.service";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { FormlyFieldConfig } from "@ngx-formly/core";

import { FetchResult } from "./fetch-result";
import { TableFetchResult } from "./table-fetcher";

/**
 * Base class for services giving access to model objects such as borrowers or items.
 */
export abstract class ModelsService<T> {
  /** Cached field fetched from server. */
  private cols: Column[];

  /**
   * @param basePath base path for the REST API for the model
   * @param id function returning the id of a model object
   * @param rpc RPC service wrapper
   * @param formService access to the form definitions (using formly forms)
   */
  protected constructor(
    protected basePath: string,
    public id: (T) => any,
    protected rpc: RpcService,
    protected formService: FormService) {
  }

  getColumns(): Observable<Column[]> {
    return this.cols
      ? of(this.cols)
      : this.rpc.httpGet(this.basePath + '/fields').pipe(tap(cols => this.cols = cols));
  }

  /**
   * Returns the formly form fields for the edit page of the model.
   *
   * @param selected Keys of the fields to return (in this order)
   */
  getFormlyFields(selected?: string[], colFn?: (Column) => Column): Observable<FormlyFieldConfig[]> {
    return this.getColumns().pipe(map(cols => {
      const newCols = colFn ? cols.map(colFn) : cols;
      return this.formService.formlyFields(newCols, selected)
    }));
  }

  /**
   * Returns the read-only form fields for the view page of the model.
   *
   * @param selected Names of the fields to return (in this order)
   */
  getViewFields(selected?: string[]): Observable<ViewFormField[]> {
    return this.getColumns().pipe(map(cols => this.formService.viewFormFields(cols, selected)));
  }

  /**
   * Converts the row coming from the server to the model object.
   */
  abstract toModel(row: any): T;

  /**
   * Gives derived classes a chance to modify an object before it is saved.
   */
  beforeSave(model: T) {
  }

  beforeAdd(model: T) {
    this.beforeSave(model);
  }

  toModels(rows: Object[]): T[] {
    return rows.map(this.toModel);
  }

  toTableFetchResult(result: FetchResult): TableFetchResult<T> {
    return new TableFetchResult(this.toModels(result.rows), result.count);
  }

  /**
   * Gets a single object identified by id.
   */
  get(id: any, params?): Observable<T> {
    return this.rpc.httpGet(this.basePath + '/' + id, params).pipe(map(obj => this.toModel(obj)));
  }

  getMany(criteria, offset, limit, returnCount): Observable<TableFetchResult<T>> {
    return this.rpc.fetch(this.basePath, criteria, offset, limit, returnCount)
      .pipe(map(result => this.toTableFetchResult(result)));
  }

  save(model: T) {
    const storedModel = Object.assign({}, model);
    this.beforeSave(storedModel);
    return this.rpc.httpPut(this.basePath, storedModel).pipe(map(obj => this.toModel(obj)));
  }

  add(model: T): Observable<T> {
    const storedModel = Object.assign({}, model);
    this.beforeAdd(storedModel);
    return this.rpc.httpPost(this.basePath, storedModel).pipe(map(obj => this.toModel(obj)));
  }

  remove(model: T) {
    return this.rpc.httpDelete(this.basePath + '/' + this.id(model));
  }
}
