import { NgModule } from '@angular/core';
import { ConfigService } from "./config.service";
import { RpcService } from "./rpc.service";
import { ErrorService } from "./error-service";
import { FormService } from "./form.service";

/**
 * Angular module for the shared services.
 */
@NgModule({
  providers: [
    ConfigService,
    RpcService,
    ErrorService,
    FormService,
  ]
})
export class CoreModule { }
