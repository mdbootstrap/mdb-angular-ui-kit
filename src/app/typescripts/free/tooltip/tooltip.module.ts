import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { TooltipContainerComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';
import { TooltipConfig } from './tooltip.service';
import { ComponentLoaderFactory } from '../utils/component-loader';
import { PositioningService } from '../utils/positioning';

@NgModule({
  imports: [CommonModule],
  declarations: [TooltipDirective, TooltipContainerComponent],
  exports: [TooltipDirective],
  entryComponents: [TooltipContainerComponent]
})
export class MDBTooltipModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: MDBTooltipModule,
      providers: [TooltipConfig, ComponentLoaderFactory, PositioningService]
    };
  };
}
