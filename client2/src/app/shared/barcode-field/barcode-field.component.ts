import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'gsl-barcode-field',
  templateUrl: './barcode-field.component.html',
  styleUrls: ['./barcode-field.component.css']
})
export class BarcodeFieldComponent implements OnInit {
  barcodeCtrl: FormControl;
  barcode: string = '';

  @Input()
  icon = 'add';

  @Input()
  focus = true;

  @Output()
  barcodeSubmit: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.barcodeCtrl = new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9)
      ])
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;
    const c = String.fromCharCode(event.charCode);
    if (event.charCode != 13 && !pattern.test(c)) {
      event.preventDefault();
    }
  }

  onSubmit(value) {
    this.barcodeSubmit.emit(this.barcode);
  }
}
