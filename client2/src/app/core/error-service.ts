import { EventEmitter, Injectable, Output } from "@angular/core";

/**
 * Central service for error notifications.
 *
 * If an error happens anywhere in the application, it can be sent to
 * this service which in turn will emit an error event that can be
 * picked up in a central place, for exammple, to show an error message.
 */
@Injectable()
export class ErrorService {
  @Output()
  error = new EventEmitter();

  showError(message) {
    this.error.emit({message});
  }
}

