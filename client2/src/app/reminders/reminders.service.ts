import { Injectable } from "@angular/core";
import { RpcService } from "../core/rpc.service";
import { Observable } from "rxjs";
import { BorrowerReminder } from "../borrowers/shared/borrower";

/**
 * Service providing the reminder functions communicating with the backend.
 */
@Injectable({providedIn: 'root'})
export class RemindersService {
  constructor(
    private readonly rpc: RpcService,
  ) {}

  generateReminders(): Observable<BorrowerReminder[]> {
    return this.rpc.httpGet('borrowers/reminders');
  }
}
