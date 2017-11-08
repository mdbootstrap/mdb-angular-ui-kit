import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { TooltipContainerComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';
import { TooltipConfig } from './tooltip.service';
import { MDBCommonModule } from '../utils/mdb-common.module';

@NgModule({
  imports: [CommonModule, MDBCommonModule],
  declarations: [TooltipDirective, TooltipContainerComponent],
  exports: [TooltipDirective],
  entryComponents: [TooltipContainerComponent]
})
export class MDBTooltipModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: MDBTooltipModule,
      providers: [TooltipConfig]
    };
  }
}
