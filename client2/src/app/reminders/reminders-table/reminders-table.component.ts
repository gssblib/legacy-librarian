import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import { BorrowerReminder } from "../../borrowers/shared/borrower";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: 'gsl-reminders-table',
  templateUrl: './reminders-table.component.html',
  styleUrls: ['./reminders-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemindersTableComponent implements AfterViewInit {
  readonly dataSource = new MatTableDataSource<BorrowerReminder>([]);

  @Input() set reminders(reminders: BorrowerReminder[]) {
    this.dataSource.data = reminders;
    this.changeDetectorRef.markForCheck();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  readonly displayedColumns = ['recipient', 'emailText'];

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  firstLine(text: string): string {
    const newline = text.indexOf('\n');
    return text.substring(0, newline);
  }

  rest(text: string): string {
    const newline = text.indexOf('\n');
    return text.substring(newline + 1);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
