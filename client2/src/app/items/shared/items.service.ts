import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { ConfigService } from "../../core/config.service";
import { Observable } from "rxjs";
import { Item } from "./item";

@Injectable()
export class ItemsService {

  constructor(private config: ConfigService, private http: Http) { }

  getItem(barcode: string): Observable<Item> {
    const obs = this.http.get(this.config.apiPath('items/' + barcode));
    return obs
      .map((response: Response) => {
        return response.json() || {};
      });
  }
}
