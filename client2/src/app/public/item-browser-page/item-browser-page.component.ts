import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TdPagingBarComponent } from "@covalent/core";
import { Subscription } from "rxjs/Subscription";
import { TableFetchResult } from "../../core/table-fetcher";
import { ParamsUtil } from "../../core/params-util";
import { SortKey } from "../../core/sort-key";
import { ConfigService } from "../../core/config.service";
import { ItemsService } from "../../items/shared/items.service";
import { ItemState } from "../../items/shared/item-state";
import { ItemSearchPageComponent } from '../../items/item-search-page/item-search-page.component';

@Component({
  selector: 'gsl-item-browser-page',
  templateUrl: './item-browser-page.component.html',
  styleUrls: ['./item-browser-page.component.css']
})
export class ItemBrowserPageComponent extends ItemSearchPageComponent {
  searchFields: string[] = ['title', 'author', 'description', 'age'];
  extraCriteria: Object = {'state': 'CIRCULATING'}
}
