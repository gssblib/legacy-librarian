import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BorrowersService } from "../shared/borrowers.service";
import { BorrowerService } from "../shared/borrower.service";
import { Borrower } from "../shared/borrower";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { RpcError } from "../../core/rpc-error";
import { NotificationService } from "../../core/notification-service";

@Component({
  selector: 'gsl-borrower-reminders',
  templateUrl: './borrower-reminders.component.html',
  styleUrls: ['./borrower-reminders.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BorrowerRemindersComponent implements OnInit, OnDestroy {
  readonly destroyed = new Subject<void>();

  borrower: Borrower;

  constructor(
    private borrowersService: BorrowersService,
    private borrowerService: BorrowerService,
    private notificationService: NotificationService,
  ) {
    this.borrowerService.modelObservable
      .pipe(takeUntil(this.destroyed))
      .subscribe(borrower => {
        this.borrower = borrower;
      });
  }

  ngOnInit(): void {
    this.borrower = this.borrowerService.get();
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  sendReminder() {
    this.borrowersService.sendReminder(this.borrower.borrowernumber).subscribe(
      result => {
        this.notificationService.show('reminder email sent');
      },
      (error: RpcError) => {
        this.notificationService.showError('error sending reminder');
      }
    );
  }
}
