

// free
import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { DeepModule } from './inputs/deep.module';
import { ButtonsModule } from './buttons/buttons.module';
import { RippleModule } from './ripple/ripple.module';
import { NavbarModule } from './navbars/navbar.module';
import { DropdownModule } from './dropdown/dropdown.module';
import { CarouselModule } from './carousel/carousel.module';
import { ChartsModule } from './charts/chart.module';
import { CollapseModule } from './collapse/collapse.module';
import { ModalModule } from './modals/modal.module';
import { TooltipModule } from './tooltip/tooltip.module';
import { PopoverModule } from './popover/popover.module';
import { InputsModule } from './inputs/inputs.module';
import { WavesModule } from './waves/waves.module';
import { ActiveModule } from './inputs/active.module';
export {
  ButtonsModule, ButtonRadioDirective, ButtonCheckboxDirective
} from './buttons/index';

export {
  RippleModule, RippleDirective
} from './ripple/index';

export {
  WavesModule, WavesDirective
} from './waves/index';

export {
  DeepModule, DeepDirective
} from './inputs/index';

export {
  InputsModule, MdbInputDirective
} from './inputs/index';

export {
  ActiveModule, ActiveDirective, InputValidateDirective
} from './inputs/index';

export {
  NavbarModule
} from './navbars/index';

export {
  BsDropdownConfig, BsDropdownContainerComponent, BsDropdownDirective, BsDropdownMenuDirective,
  DropdownModule, BsDropdownState, BsDropdownToggleDirective
} from './dropdown/index';

export {
  CarouselComponent, CarouselConfig, CarouselModule
} from './carousel/index';

export {
  ChartsModule, BaseChartDirective
} from './charts/index';

export {
  CollapseDirective, CollapseModule
} from './collapse/index';

export {
  ModalBackdropComponent, ModalBackdropOptions, ModalDirective, ModalModule, ModalOptions, MDBModalService,
  ModalContainerComponent, MDBModalRef
} from './modals/index';

export {
  TooltipConfig, TooltipContainerComponent, TooltipDirective, TooltipModule
} from './tooltip/index';

export {
  PopoverConfig, PopoverContainerComponent, PopoverModule, PopoverDirective
} from './popover/index';



const MODULES = [
  DeepModule,
  ButtonsModule,
  RippleModule,
  WavesModule,
  InputsModule,
  ActiveModule,
  NavbarModule,
  DropdownModule,
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
    DeepModule,
    RippleModule.forRoot(),
    WavesModule.forRoot(),
    InputsModule.forRoot(),
    ActiveModule.forRoot(),
    NavbarModule,
    DropdownModule.forRoot(),
    CarouselModule.forRoot(),
    ChartsModule,
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
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
