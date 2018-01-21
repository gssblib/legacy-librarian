import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReportsPageComponent } from "./reports-page/reports-page.component";
import { ReportItemUsageComponent } from "./report-item-usage/report-item-usage.component";
import { ReportOverdueComponent } from './report-overdue/report-overdue.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'reports', component: ReportsPageComponent,
        children: [
          {path: 'item-usage', component: ReportItemUsageComponent},
          {path: 'overdue', component: ReportOverdueComponent},
        ]
      },

    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ReportsRoutingModule {
}
