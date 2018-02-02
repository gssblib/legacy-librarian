import { NgModule } from '@angular/core';
import { AuthGuard } from '../core/auth.guard';
import { ConfigService } from './config.service';
import { RpcService } from './rpc.service';
import { ErrorService } from './error-service';
import { NotificationService } from './notification-service';
import { FormService } from './form.service';
import { AuthenticationService } from './auth.service';
import { Action, AuthorizationService } from './authorization.service';
import { AuthorizedDirective } from './authorized.directive';
import { DateService } from "./date-service";
import { ModelsService } from "./models.service";

/**
 * Angular module for the shared services.
 */
@NgModule({
  providers: [
    AuthGuard,
    ConfigService,
    RpcService,
    ErrorService,
    NotificationService,
    FormService,
    AuthenticationService,
    AuthorizationService,
    DateService,
    Action,
  ],
  declarations: [
    AuthorizedDirective,
  ],
  exports: [
    AuthorizedDirective,
  ]
})
export class CoreModule { }
