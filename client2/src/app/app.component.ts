import { Component, OnInit } from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { MenuItem } from "primeng/primeng";

@Component({
  selector: 'gsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private items: MenuItem[];

  constructor() {
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Items',
        items: [
          {
            label: 'Search',
            routerLink: ['/items']
          },
          {
            label: 'New',
            icon: 'fa-edit',
            url: 'http://www.heise.de/'
          }
        ]
      }
    ];
  }
}
