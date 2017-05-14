import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

/**
 * Controls focus with the `focus` property.
 */
@Directive({
  selector: '[focus]'
})
export class FocusDirective implements OnInit, OnChanges {
  @Input('focus')
  focus: boolean;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (this.focus) {
      this.elementRef.nativeElement.focus();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.focus) {
      this.elementRef.nativeElement.focus();
    }
  }
}
