import { ModuleWithProviders, NgModule } from '@angular/core';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';

import { PositioningService } from '../utils/positioning/positioning.service';
import { BsDropdownContainerComponent } from './dropdown-container.component';
import { BsDropdownMenuDirective } from './dropdown-menu.directive';
import { BsDropdownToggleDirective } from './dropdown-toggle.directive';
import { BsDropdownConfig } from './dropdown.config';

import { BsDropdownDirective } from './dropdown.directive';
import { BsDropdownState } from './dropdown.state';

@NgModule({
  declarations: [
  BsDropdownMenuDirective,
  BsDropdownToggleDirective,
  BsDropdownContainerComponent,
  BsDropdownDirective
  ],
  exports: [
  BsDropdownMenuDirective,
  BsDropdownToggleDirective,
  BsDropdownDirective
  ],
  entryComponents: [BsDropdownContainerComponent]
})
export class DropdownModule {
  public static forRoot(config?: any): ModuleWithProviders {
    return {
      ngModule: DropdownModule, providers: [
      ComponentLoaderFactory,
      PositioningService,
      BsDropdownState,
      {provide: BsDropdownConfig, useValue: config ? config : {autoClose: true}}
      ]
    };
  }
}
