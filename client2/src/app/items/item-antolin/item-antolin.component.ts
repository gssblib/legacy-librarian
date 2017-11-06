import { Component, Input } from '@angular/core';

@Component({
  selector: 'gsl-item-antolin',
  templateUrl: './item-antolin.component.html',
  styleUrls: ['./item-antolin.component.css']
})
export class ItemAntolinComponent {
  @Input('antolin') antolin;

  constructor() { }

}
