import { Injectable } from '@angular/core';

/**
 * Configuration shared across the application.
 */
@Injectable()
export class ConfigService {
  /** Base path for the REST API. */
  private _api: string = '/api/';
  private _labelsApi: string = 'http://localhost:3001/';

  constructor() { }

  apiPath(path: string): string {
    return this._api + path;
  }

  labelsApiPath(path: string): string {
    return this._labelsApi + path;
  }
}
