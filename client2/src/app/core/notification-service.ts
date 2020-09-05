import { EventEmitter, Injectable, Output, Directive } from "@angular/core";

/**
 * Central service for notifications (completed operations, errors).
 *
 * Any component can sent a notification to this service which will publish the
 * message as a notication event that gets picked up in a central place of the
 * application.
 */
@Directive()
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

