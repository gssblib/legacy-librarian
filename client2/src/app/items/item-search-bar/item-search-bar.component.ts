import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'gsl-item-search-bar',
  templateUrl: './item-search-bar.component.html',
  styleUrls: ['./item-search-bar.component.css']
})
export class ItemSearchBarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  showItem(item) {
    this.router.navigate(['/items', item.barcode, 'details']);
  }
}
