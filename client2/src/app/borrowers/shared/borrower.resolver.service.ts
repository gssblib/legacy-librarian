
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Borrower } from './borrower';
import { Injectable } from '@angular/core';
import { BorrowersService } from './borrowers.service';

@Injectable()
export class BorrowerResolverService implements Resolve<Borrower> {
  constructor(private borrowersService: BorrowersService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Borrower> {
    const id = route.params['id'];
    return this.borrowersService.get(id, {options: 'items,orders,fees'});
  }
}
