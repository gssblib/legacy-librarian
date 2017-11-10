import { NgModule } from '@angular/core';
import { AuthGuard } from "../core/auth.guard";
import { ConfigService } from "./config.service";
import { RpcService } from "./rpc.service";
import { ErrorService } from "./error-service";
import { NotificationService } from "./notification-service";
import { FormService } from "./form.service";
import { AuthenticationService } from "./auth.service";

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
  ]
})
export class CoreModule { }
