import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'gsl-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.css']
})
export class ReportsPageComponent implements OnInit {
  navLinks = [
    { link: 'item-usage', label: 'Item Usage'},
    { link: 'overdue', label: 'Overdue'},
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
  }
}
