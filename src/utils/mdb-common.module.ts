import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ComponentLoaderFactory } from '../utils/component-loader/index';
import { PositioningService } from './positioning/positioning.service';

@NgModule({
  imports: [CommonModule]
})
export class MDBCommonModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: MDBCommonModule,
      providers: [ComponentLoaderFactory, PositioningService]
    };
  }
}
