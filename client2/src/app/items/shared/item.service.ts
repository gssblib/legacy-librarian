import { Injectable } from '@angular/core';
import { RpcService } from "../../core/rpc.service";
import { Item } from './item';

@Injectable()
export class ItemService {
  item: Item;

  constructor() {
  }
}
