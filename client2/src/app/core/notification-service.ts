import { EventEmitter, Injectable, Output } from "@angular/core";
import { ErrorService } from "./error-service";

/**
 * Central service for notification notifications.
 *
 * If an notification happens anywhere in the application, it can be sent to
 * this service which in turn will emit an notification event that can be
 * picked up in a central place, for exammple, to show an notification message.
 */
@Injectable()
export class NotificationService {
  @Output()
  notification = new EventEmitter();

  constructor(private errorService: ErrorService) {
  }

  showError(message, error?) {
    if (error !== undefined) {
      message = `${message} (${error.message})`;
    }
    this.errorService.showError(message);
  }

  show(message) {
    this.notification.emit({message});
  }
}

