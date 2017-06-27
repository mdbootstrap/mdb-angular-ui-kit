import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { TooltipContainerComponent } from './tooltipContainerComponent';
import { TooltipDirective } from './tooltipDirective';
import { TooltipConfig } from './tooltipConfig';
import { ComponentLoaderFactory } from '../utils/component-loader';
import { PositioningService } from '../utils/positioning';

@NgModule({
  imports: [CommonModule],
  declarations: [TooltipDirective, TooltipContainerComponent],
  exports: [TooltipDirective],
  entryComponents: [TooltipContainerComponent]
})
export class TooltipModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: TooltipModule,
      providers: [TooltipConfig, ComponentLoaderFactory, PositioningService]
    };
  };
}