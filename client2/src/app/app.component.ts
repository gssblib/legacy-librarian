import { Component, OnInit } from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Component({
  selector: 'gsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  constructor() {
  }

  ngOnInit(): void {
  }
}
