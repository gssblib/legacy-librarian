import { EventEmitter, Injectable, Output } from "@angular/core";

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

  showError(message: string, error?) {
    this.show(this.errorMessage(message, error));
  }

  private errorMessage(message: string, error): string {
    return error ? `${message} (${error.message})` : message;
  }

  show(message: string) {
    this.notification.emit({message});
  }
}

