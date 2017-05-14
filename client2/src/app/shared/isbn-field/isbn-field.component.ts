import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'gsl-isbn-field',
  templateUrl: './isbn-field.component.html',
  styleUrls: ['./isbn-field.component.css']
})
export class IsbnFieldComponent implements OnInit {
  isbnCtrl: FormControl;
  isbn: string = '';

  @Input()
  icon = 'add';

  @Input()
  focus = false;

  @Output()
  isbnSubmit: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.isbnCtrl = new FormControl('', [
      Validators.required,
    ]);
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;
    const c = String.fromCharCode(event.charCode);
    if (event.charCode != 13 && !pattern.test(c)) {
      event.preventDefault();
    }
  }

  onSubmit(value) {
    this.isbnSubmit.emit(this.isbn);
  }
}
