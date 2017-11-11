import { Directive, TemplateRef, ViewContainerRef, Input, OnInit } from '@angular/core';
import { AuthenticationService } from './auth.service';
import { Action, AuthorizationService } from './authorization.service';

@Directive({
  selector: '[gslAuthorized]',
})
export class AuthorizedDirective implements OnInit {
  private hasView = false;

  @Input('gslAuthorized') action: Action | string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService,
  ) {
    this.authenticationService.userObservable.subscribe(
      user => this.update());
  }

  ngOnInit() {
    this.update();
  }

  update() {
    var isAuthorized = this.authorizationService.isAuthorized(this.action);
    if (isAuthorized && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!isAuthorized && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
