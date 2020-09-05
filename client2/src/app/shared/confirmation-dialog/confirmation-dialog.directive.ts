import { Directive, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import {MatDialog} from "@angular/material/dialog";

export interface ConfirmCancelEvent {
  clickEvent: MouseEvent;
}

@Directive({
  selector: '[gslConfirmationDialog]'
})
export class ConfirmationDialogDirective {

  @Input() title: string;
  @Input() message: string;

  @Output() confirm: EventEmitter<ConfirmCancelEvent> = new EventEmitter();
  @Output() cancel: EventEmitter<ConfirmCancelEvent> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
  ) { }

  @HostListener('click')
  openDialog() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {title: this.title, message: this.message},
    });
    dialogRef.afterClosed().subscribe(event => {
      if (event)
        this.onConfirm(event);
      else
        this.onCancel(event);
    });
    return false;
  }

  onConfirm(event: ConfirmCancelEvent): void {
    this.confirm.emit(event);
  }

  onCancel(event: ConfirmCancelEvent): void {
    this.cancel.emit(event);
  }

}
