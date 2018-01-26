import { NgModule } from '@angular/core';

import { BaseChartDirective } from './chart.directive';

@NgModule({
  declarations: [
  BaseChartDirective
  ],
  exports: [
  BaseChartDirective
  ],
  imports: []
})
export class MDBChartsModule {
}
