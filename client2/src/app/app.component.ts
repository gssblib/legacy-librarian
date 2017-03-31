import { Component, OnInit } from '@angular/core';
import { Item } from "./items/shared/item";
import { ItemsService } from "./items/shared/items.service";
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'

@Component({
  selector: 'gsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  item: Item;

  constructor(private itemService: ItemsService) {
  }

  ngOnInit(): void {
    this.itemService.getItem('000000369').subscribe(item => {
      console.log("received item: ", item);
      this.item = item;
    });
  }
}
