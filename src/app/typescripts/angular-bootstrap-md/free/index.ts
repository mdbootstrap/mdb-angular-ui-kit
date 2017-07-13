//free
import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { ButtonsModule } from './buttons';
import { rippleModule } from './ripple';
import { activeModule } from './inputs';
import { NavbarModule } from './navbars';
import { BsDropdownModule } from './dropdown';
import { CarouselModule } from './carousel/';
import { ChartsModule } from './charts/';
import { CollapseModule } from './collapse'
import { ModalModule } from './modals';
import { TooltipModule } from './tooltip';
import { PopoverModule } from './popover';

export { 
  ButtonsModule, ButtonRadioDirective, ButtonCheckboxDirective 
} from './buttons/';

export {
  rippleModule, RippleDirective
} from './ripple/';

export {
  activeModule, ActiveDirective
} from './inputs/';

export {
  NavbarModule, Navbars
} from './navbars/';

export {
  BsDropdownConfig, BsDropdownContainerComponent, BsDropdownDirective, BsDropdownMenuDirective, BsDropdownModule, BsDropdownState, BsDropdownToggleDirective
} from './dropdown/';

export {
  CarouselComponent, CarouselConfig, CarouselModule
} from './carousel/';

export {
  ChartsModule, BaseChartDirective
} from './charts/';

export {
  CollapseDirective, CollapseModule
} from './collapse/';

export {
  ModalBackdropComponent, ModalBackdropOptions, ModalDirective, ModalModule, ModalOptions
} from './modals/';

export {
  TooltipConfig, TooltipContainerComponent, TooltipDirective, TooltipModule
} from './tooltip/';

export {
PopoverConfig, PopoverContainerComponent, PopoverModule, PopoverDirective
} from './popover/';


const MODULES = [
    ButtonsModule,
    rippleModule,
    activeModule,
    NavbarModule,
    BsDropdownModule,
    CarouselModule,
    ChartsModule,
    CollapseModule,
    ModalModule,
    TooltipModule,
    PopoverModule,
];

@NgModule({
  imports: [
    ButtonsModule,
    rippleModule.forRoot(),
    activeModule.forRoot(),
    NavbarModule,
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    ChartsModule,
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
  ],
  exports: MODULES,
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class MDBRootModule {
}

@NgModule({exports: MODULES})
export class MDBBootstrapModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: MDBRootModule};
  }
}
