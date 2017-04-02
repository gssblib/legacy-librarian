import { TestBed, inject } from '@angular/core/testing';

import { BorrowersService } from './borrowers.service';

describe('BorrowersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BorrowersService]
    });
  });

  it('should ...', inject([BorrowersService], (service: BorrowersService) => {
    expect(service).toBeTruthy();
  }));
});
