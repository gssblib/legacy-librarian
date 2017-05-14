import { Directive, ElementRef, OnInit } from "@angular/core";

/**
 * Puts focus on an element marked the the `autofocus` attribute.
 */
@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.focus();
  }
}
