import { NgModule } from '@angular/core';
import { ConfigService } from "./config.service";
import { RpcService } from "./rpc.service";

/**
 * Angular module for the shared services.
 */
@NgModule({
  providers: [
    ConfigService,
    RpcService
  ]
})
export class CoreModule { }
