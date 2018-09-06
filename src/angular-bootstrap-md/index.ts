
// free
import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { CardsFreeModule } from './cards/cards.module';
import { ButtonsModule } from './buttons/buttons.module';
import { RippleModule } from './ripple/ripple.module';
import { InputsModule } from './inputs/inputs.module';
import { NavbarModule } from './navbars/navbar.module';
import { DropdownModule } from './dropdown/dropdown.module';
import { CarouselModule } from './carousel/carousel.module';
import { ChartsModule } from './charts/chart.module';
import { CollapseModule } from './collapse/collapse.module';
import { ModalModule } from './modals/modal.module';
import { TooltipModule } from './tooltip/tooltip.module';
import { PopoverModule } from './popover/popover.module';
import { WavesModule } from './waves/waves.module';
import { IconsModule } from './icons/icon.module';
import { CheckboxModule } from './checkbox/checkbox.module';

export {
  ButtonsModule, ButtonRadioDirective, ButtonCheckboxDirective, MdbBtnDirective
} from './buttons/index';

export {
  CHECKBOX_VALUE_ACCESSOR, CheckboxComponent, CheckboxModule
} from './checkbox/index';

export {
  CardsFreeModule,
  MdbCardComponent,
  MdbCardBodyComponent,
  MdbCardImageComponent,
  MdbCardTextComponent,
  MdbCardTitleComponent,
  MdbCardFooterComponent,
  MdbCardHeaderComponent
} from './cards/index';

export {
  RippleModule, RippleDirective
} from './ripple/index';

export {
  WavesModule, WavesDirective
} from './waves/index';

export {
  InputsModule, MdbInputDirective
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
  CollapseComponent, CollapseModule
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

export {
  IconsModule, MdbIconComponent
} from './icons/index';



const MODULES = [
  ButtonsModule,
  CardsFreeModule,
  RippleModule,
  WavesModule,
  InputsModule,
  NavbarModule,
  DropdownModule,
  CarouselModule,
  ChartsModule,
  CollapseModule,
  ModalModule,
  TooltipModule,
  PopoverModule,
  IconsModule,
  CheckboxModule

];

@NgModule({
  imports: [
    ButtonsModule,
    RippleModule.forRoot(),
    WavesModule.forRoot(),
    InputsModule.forRoot(),
    NavbarModule,
    DropdownModule.forRoot(),
    CarouselModule.forRoot(),
    ChartsModule,
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    IconsModule,
    CardsFreeModule.forRoot(),
    CheckboxModule
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
