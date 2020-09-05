import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Borrower } from '../shared/borrower';
import { BorrowersService } from '../shared/borrowers.service';

/**
 * Auto-complete component for borrowers using the borrower last name (or
 * parts of it) for the completion.
 */
@Component({
  selector: 'gsl-borrower-auto-complete',
  templateUrl: './borrower-auto-complete.component.html',
  styleUrls: ['./borrower-auto-complete.component.css']
})
export class BorrowerAutoCompleteComponent implements OnInit, AfterViewInit {
  @ViewChild('borrowerInput', { static: true })
  inputElementRef: ElementRef;

  /** FormControl for the borrower name input field. */
  input: FormControl;

  /** Borrowers shown in the auto completion list. */
  suggestions: Borrower[];

  @Output()
  borrowerSelected: EventEmitter<Borrower> = new EventEmitter();

  @Input()
  size: number = 20;

  constructor(private borrowersService: BorrowersService) {
  }

  ngOnInit() {
    this.input = new FormControl();
    this.input.valueChanges.subscribe(value => this.onChange(value));
  }

  ngAfterViewInit() {
    // using the `autofocus` attribute in the template causes an exception in the
    // autocomplete directive
    this.inputElementRef.nativeElement.focus();
  }

  private onChange(value) {
    if (typeof value === 'object') {
      this.suggestions = [];
      this.input.setValue('');
      this.borrowerSelected.emit(value);
    } else {
      this.fetchSuggestions(value);
    }
  }

  private fetchSuggestions(value) {
    if (value === '') {
      this.suggestions = [];
    } else {
      this.borrowersService.getMany({surname: value, state: 'ACTIVE'}, 0, this.size, false).subscribe(
        borrowers => {
            this.suggestions = borrowers.rows;
          });
    }
  }

  public displayName(borrower: Borrower): string {
    return borrower
      ? `${borrower.surname}, ${borrower.firstname}, ${borrower.contactname}`
      : '';
  }

  /**
   * Select the first child in the suggestions.
   */
  selectFirstBorrower() {
    var value = this.suggestions[0];
    if (value !== undefined) {
      this.suggestions = [];
      this.borrowerSelected.emit(value);
    }
  }
}
