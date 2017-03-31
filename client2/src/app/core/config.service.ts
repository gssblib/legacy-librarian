import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  private _api: string = '/api/';

  constructor() { }

  apiPath(path: string): string {
    return this._api + path;
  }
}
