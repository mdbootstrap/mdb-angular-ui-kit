import { ModuleWithProviders } from '@angular/core';
export { ButtonsModule, ButtonRadioDirective, ButtonCheckboxDirective } from './buttons/index';
export { RippleModule, RippleDirective } from './ripple/index';
export { WavesModule, WavesDirective } from './waves/index';
export { DeepModule, DeepDirective } from './inputs/index';
export { InputsModule, MdbInputDirective } from './inputs/index';
export { ActiveModule, ActiveDirective, InputValidateDirective } from './inputs/index';
export { NavbarModule } from './navbars/index';
export { BsDropdownConfig, BsDropdownContainerComponent, BsDropdownDirective, BsDropdownMenuDirective, DropdownModule, BsDropdownState, BsDropdownToggleDirective } from './dropdown/index';
export { CarouselComponent, CarouselConfig, CarouselModule } from './carousel/index';
export { ChartsModule, BaseChartDirective } from './charts/index';
export { CollapseDirective, CollapseModule } from './collapse/index';
export { ModalBackdropComponent, ModalBackdropOptions, ModalDirective, ModalModule, ModalOptions, MDBModalService, ModalContainerComponent, MDBModalRef } from './modals/index';
export { TooltipConfig, TooltipContainerComponent, TooltipDirective, TooltipModule } from './tooltip/index';
export { PopoverConfig, PopoverContainerComponent, PopoverModule, PopoverDirective } from './popover/index';
export declare class MDBRootModule {
}
export declare class MDBBootstrapModule {
    static forRoot(): ModuleWithProviders;
}
