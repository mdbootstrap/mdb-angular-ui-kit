// free
import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonsModule } from './buttons/buttons.module';
import { RippleModule } from './ripple/ripple.module';
import { ActiveModule } from './inputs/active.module';
import { NavbarModule } from './navbars/navbar.module';
import { BsDropdownModule } from './dropdown/dropdown.module';
import { CarouselModule } from './carousel/carousel.module';
import { MDBChartsModule } from './charts/chart.module';
import { CollapseModule } from './collapse/collapse.module';
import { ModalModule } from './modals/modal.module';
import { MDBTooltipModule } from './tooltip/tooltip.module';
import { PopoverModule } from './popover/popover.module';
import { MDBCommonModule } from './utils/mdb-common.module';

export {
  ButtonsModule, ButtonRadioDirective, ButtonCheckboxDirective
} from './buttons/index';

export {
  RippleModule, RippleDirective
} from './ripple/index';

export {
  ActiveModule, ActiveDirective, InputValidateDirective
} from './inputs/index';

export {
  NavbarModule, NavbarComponent
} from './navbars/index';

export {
  BsDropdownModule, BsDropdownConfig, BsDropdownContainerComponent, BsDropdownDirective,
  BsDropdownMenuDirective, BsDropdownState, BsDropdownToggleDirective
} from './dropdown/index';

export {
  CarouselModule, CarouselComponent, CarouselConfig
} from './carousel/index';

export {
  MDBChartsModule, BaseChartDirective
} from './charts/index';

export {
  CollapseModule, CollapseDirective
} from './collapse/index';

export {
  ModalModule, ModalBackdropComponent, ModalBackdropOptions, ModalDirective, ModalOptions, MDBModalService,
  ModalContainerComponent, MDBModalRef
} from './modals/index';

export {
  MDBTooltipModule, TooltipConfig, TooltipContainerComponent, TooltipDirective
} from './tooltip/index';

export {
  PopoverModule, PopoverConfig, PopoverContainerComponent, PopoverDirective
} from './popover/index';

const MODULES = [
  ButtonsModule,
  RippleModule,
  ActiveModule,
  NavbarModule,
  BsDropdownModule,
  CarouselModule,
  MDBChartsModule,
  CollapseModule,
  ModalModule,
  MDBTooltipModule,
  PopoverModule,
];

@NgModule({
  imports: [
    CommonModule,
    ButtonsModule.forRoot(),
    RippleModule.forRoot(),
    ActiveModule.forRoot(),
    NavbarModule,
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    MDBChartsModule,
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    MDBTooltipModule.forRoot(),
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
