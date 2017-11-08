import { ModuleWithProviders, NgModule } from '@angular/core';

import { BsDropdownContainerComponent } from './dropdown-container.component';
import { BsDropdownMenuDirective } from './dropdown-menu.directive';
import { BsDropdownToggleDirective } from './dropdown-toggle.directive';
import { BsDropdownConfig } from './dropdown.config';

import { BsDropdownDirective } from './dropdown.directive';
import { BsDropdownState } from './dropdown.state';
import { CommonModule } from '@angular/common';
import { MDBCommonModule } from '../utils/mdb-common.module';

@NgModule({
  declarations: [
  BsDropdownMenuDirective,
  BsDropdownToggleDirective,
  BsDropdownContainerComponent,
  BsDropdownDirective
  ],
  imports: [CommonModule, MDBCommonModule],
  exports: [
  BsDropdownMenuDirective,
  BsDropdownToggleDirective,
  BsDropdownDirective
  ],
  entryComponents: [BsDropdownContainerComponent]
})
export class BsDropdownModule {
  public static forRoot(config?: any): ModuleWithProviders {
    return {
      ngModule: BsDropdownModule, providers: [
      BsDropdownState,
      {provide: BsDropdownConfig, useValue: config ? config : {autoClose: true}}
      ]
    };
  }
}
