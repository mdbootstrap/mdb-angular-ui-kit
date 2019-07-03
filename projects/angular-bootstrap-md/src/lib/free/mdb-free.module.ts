// free
import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { CardsModule } from './cards/cards.module';
import { ButtonsModule } from './buttons/buttons.module';
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
import { IconsModule } from './icons/icon.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { TableModule } from './tables/tables.module';
import { BadgeModule } from './badge/badge.module';
import { BreadcrumbModule } from './breadcrumbs/breadcrumb.module';
import { InputUtilitiesModule } from './input-utilities/input-utilities.module';
import { StickyHeaderModule } from './sticky-header/sticky-header.module';

export { StickyHeaderDirective, StickyHeaderModule } from './sticky-header/index';

export {
  MdbErrorDirective,
  MdbSuccessDirective,
  MdbValidateDirective,
  InputUtilitiesModule,
} from './input-utilities/index';

export {
  MdbBreadcrumbComponent,
  MdbBreadcrumbItemComponent,
  BreadcrumbModule,
} from './breadcrumbs/index';

export { MDBBadgeComponent, BadgeModule } from './badge/index';

export {
  MdbTablePaginationComponent,
  MdbTableRowDirective,
  MdbTableScrollDirective,
  MdbTableSortDirective,
  MdbTableDirective,
  MdbTableService,
  TableModule,
} from './tables/index';

export { CHECKBOX_VALUE_ACCESSOR, CheckboxComponent, CheckboxModule } from './checkbox/index';

export {
  ButtonsModule,
  ButtonRadioDirective,
  ButtonCheckboxDirective,
  MdbBtnDirective,
  FixedButtonCaptionDirective,
} from './buttons/index';

export {
  CardsModule,
  MdbCardComponent,
  MdbCardBodyComponent,
  MdbCardImageComponent,
  MdbCardTextComponent,
  MdbCardTitleComponent,
  MdbCardFooterComponent,
  MdbCardHeaderComponent,
} from './cards/index';

export { WavesModule, WavesDirective } from './waves/index';

export { InputsModule, MdbInputDirective, MdbInput } from './inputs/index';

export { NavbarModule } from './navbars/index';

export {
  BsDropdownConfig,
  BsDropdownContainerComponent,
  BsDropdownDirective,
  BsDropdownMenuDirective,
  DropdownModule,
  BsDropdownState,
  BsDropdownToggleDirective,
} from './dropdown/index';

export { CarouselComponent, CarouselConfig, CarouselModule } from './carousel/index';

export { ChartsModule, BaseChartDirective } from './charts/index';

export { CollapseComponent, CollapseModule } from './collapse/index';

export {
  ModalBackdropComponent,
  ModalBackdropOptions,
  ModalDirective,
  ModalModule,
  ModalOptions,
  MDBModalService,
  ModalContainerComponent,
  MDBModalRef,
} from './modals/index';

export {
  TooltipConfig,
  TooltipContainerComponent,
  TooltipDirective,
  TooltipModule,
} from './tooltip/index';

export {
  PopoverConfig,
  PopoverContainerComponent,
  PopoverModule,
  PopoverDirective,
} from './popover/index';

export {
  IconsModule,
  MdbIconComponent,
  FalDirective,
  FarDirective,
  FasDirective,
  FabDirective,
} from './icons/index';

const MODULES = [
  ButtonsModule,
  CardsModule,
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
  CheckboxModule,
  TableModule,
  BadgeModule,
  BreadcrumbModule,
  InputUtilitiesModule,
  StickyHeaderModule,
];

@NgModule({
  imports: [
    ButtonsModule,
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
    CardsModule.forRoot(),
    CheckboxModule,
    TableModule,
    BadgeModule,
    BreadcrumbModule,
    InputUtilitiesModule,
    StickyHeaderModule,
  ],
  exports: MODULES,
  schemas: [NO_ERRORS_SCHEMA],
})
export class MDBRootModule {}

@NgModule({ exports: MODULES })
export class MDBBootstrapModule {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: MDBRootModule };
  }
}
