import { ModuleWithProviders } from '@angular/core';
export { ButtonsModule, ButtonRadioDirective, ButtonCheckboxDirective } from './buttons/';
export { rippleModule, RippleDirective } from './ripple/';
export { activeModule, ActiveDirective } from './inputs/';
export { SebmGoogleMapKmlLayer, SebmGoogleMap, SebmGoogleMapCircle, SebmGoogleMapInfoWindow, SebmGoogleMapMarker, SebmGoogleMapPolygon, SebmGoogleMapPolyline, SebmGoogleMapPolylinePoint, LazyMapsAPILoader, LAZY_MAPS_API_CONFIG, LazyMapsAPILoaderConfigLiteral, MapsAPILoader, BROWSER_GLOBALS_PROVIDERS } from './angular2-google-maps/ts/core/';
export { NavbarModule, Navbars } from './navbars/';
export { BsDropdownConfig, BsDropdownContainerComponent, BsDropdownDirective, BsDropdownMenuDirective, BsDropdownModule, BsDropdownState, BsDropdownToggleDirective } from './dropdown/';
export { CarouselComponent, CarouselConfig, CarouselModule } from './carousel/';
export { ChartsModule, BaseChartDirective } from './charts/';
export { CollapseDirective, CollapseModule } from './collapse/';
export { ModalBackdropComponent, ModalBackdropOptions, ModalDirective, ModalModule, ModalOptions } from './modals/';
export { TooltipConfig, TooltipContainerComponent, TooltipDirective, TooltipModule } from './tooltip/';
export { PopoverConfig, PopoverContainerComponent, PopoverModule, PopoverDirective } from './popover/';
export declare class MDBRootModule {
}
export declare class MDBBootstrapModule {
    static forRoot(): ModuleWithProviders;
}
