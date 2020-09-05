import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

/**
 * Input field for digit-only barcodes of a fixed length.
 *
 * Restricts entered characters, defines the validators, and turns the form submission
 * into a custom `barcodeSubmit` event.
 */
@Component({
  selector: 'gsl-barcode-field',
  templateUrl: './barcode-field.component.html',
  styleUrls: ['./barcode-field.component.css']
})
export class BarcodeFieldComponent implements OnInit {
  barcodeCtrl: FormControl;

  set barcode(value: string) {
    this.barcodeCtrl.setValue(value);
  }

  /** Name of the icon for the action button. */
  @Input()
  icon = 'add';

  @Input()
  focus = true;

  @Input()
  length = 9;

  /** Fired when the barcode form is submitted (by pressing the button or hitting Enter). */
  @Output()
  barcodeSubmit: EventEmitter<string> = new EventEmitter();

  @ViewChild('input', { static: true })
  input: ElementRef;

  ngOnInit() {
    this.barcodeCtrl = new FormControl('', [
      Validators.required,
      Validators.minLength(this.length),
      Validators.maxLength(this.length)
    ]);
  }

  reset() {
    this.barcodeCtrl.reset();
  }

  setFocus() {
    this.input.nativeElement.focus();
  }

  /**
   * Accepts only digits and Enter.
   */
  keyPress(event: any) {
    const pattern = /[0-9]/;
    const c = String.fromCharCode(event.charCode);
    if (event.charCode != 13 && !pattern.test(c)) {
      event.preventDefault();
    }
  }

  onSubmit(value) {
    this.barcodeSubmit.emit(this.barcodeCtrl.value);
  }
}
