

// free
import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { DeepModule } from './inputs/';
import { ButtonsModule } from './buttons';
import { RippleModule } from './ripple';
import { ActiveModule, InputsModule } from './inputs';
import { NavbarModule } from './navbars';
import { BsDropdownModule } from './dropdown';
import { CarouselModule } from './carousel/';
import { MDBChartsModule } from './charts/';
import { CollapseModule } from './collapse';
import { ModalModule } from './modals';
import { MDBTooltipModule } from './tooltip';
import { PopoverModule } from './popover';
import { WavesModule } from './waves/waves.module';

export {
  ButtonsModule, ButtonRadioDirective, ButtonCheckboxDirective
} from './buttons/';

export {
  RippleModule, RippleDirective
} from './ripple/';

export {
  WavesModule, WavesDirective
} from './waves/';

export {
  DeepModule, DeepDirective
} from './inputs/';

export {
  InputsModule, MdbInputDirective
} from './inputs';

export {
  ActiveModule, ActiveDirective, InputValidateDirective
} from './inputs/';

export {
  NavbarModule
} from './navbars/';

export {
  BsDropdownConfig, BsDropdownContainerComponent, BsDropdownDirective, BsDropdownMenuDirective,
  BsDropdownModule, BsDropdownState, BsDropdownToggleDirective
} from './dropdown/';

export {
  CarouselComponent, CarouselConfig, CarouselModule
} from './carousel/';

export {
  MDBChartsModule, BaseChartDirective
} from './charts/';

export {
  CollapseDirective, CollapseModule
} from './collapse/';

export {
  ModalBackdropComponent, ModalBackdropOptions, ModalDirective, ModalModule, ModalOptions, MDBModalService,
  ModalContainerComponent, MDBModalRef
} from './modals/';

export {
  TooltipConfig, TooltipContainerComponent, TooltipDirective, MDBTooltipModule
} from './tooltip/';

export {
  PopoverConfig, PopoverContainerComponent, PopoverModule, PopoverDirective
} from './popover/';



const MODULES = [
  DeepModule,
  ButtonsModule,
  RippleModule,
  WavesModule,
  InputsModule,
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
    ButtonsModule,
    DeepModule,
    RippleModule.forRoot(),
    WavesModule.forRoot(),
    InputsModule.forRoot(),
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
  schemas: [NO_ERRORS_SCHEMA]
})
export class MDBRootModule {
}

@NgModule({ exports: MODULES })
export class MDBBootstrapModule {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: MDBRootModule };
  }
}
