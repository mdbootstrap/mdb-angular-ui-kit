import { NgModule } from '@angular/core';
import { SebmGoogleMapKmlLayer } from './directives/google-map-kml-layer';
import { SebmGoogleMap } from './directives/google-map';
import { SebmGoogleMapCircle } from './directives/google-map-circle';
import { SebmGoogleMapInfoWindow } from './directives/google-map-info-window';
import { SebmGoogleMapMarker } from './directives/google-map-marker';
import { SebmGoogleMapPolygon } from './directives/google-map-polygon';
import { SebmGoogleMapPolyline } from './directives/google-map-polyline';
import { SebmGoogleMapPolylinePoint } from './directives/google-map-polyline-point';
import { LazyMapsAPILoader } from './services/maps-api-loader/lazy-maps-api-loader';
import { LAZY_MAPS_API_CONFIG } from './services/maps-api-loader/lazy-maps-api-loader';
import { MapsAPILoader } from './services/maps-api-loader/maps-api-loader';
import { BROWSER_GLOBALS_PROVIDERS } from './utils/browser-globals';
/**
 * @internal
 */
export function coreDirectives() {
    return [
        SebmGoogleMap, SebmGoogleMapMarker, SebmGoogleMapInfoWindow, SebmGoogleMapCircle,
        SebmGoogleMapPolygon, SebmGoogleMapPolyline, SebmGoogleMapPolylinePoint, SebmGoogleMapKmlLayer
    ];
}
;
/**
 * The angular2-google-maps core module. Contains all Directives/Services/Pipes
 * of the core module. Please use `AgmCoreModule.forRoot()` in your app module.
 */
var AgmCoreModule = (function () {
    function AgmCoreModule() {
    }
    /**
     * Please use this method when you register the module at the root level.
     */
    AgmCoreModule.forRoot = function (lazyMapsAPILoaderConfig) {
        return {
            ngModule: AgmCoreModule,
            providers: BROWSER_GLOBALS_PROVIDERS.concat([
                { provide: MapsAPILoader, useClass: LazyMapsAPILoader },
                { provide: LAZY_MAPS_API_CONFIG, useValue: lazyMapsAPILoaderConfig }
            ]),
        };
    };
    return AgmCoreModule;
}());
export { AgmCoreModule };
AgmCoreModule.decorators = [
    { type: NgModule, args: [{ declarations: coreDirectives(), exports: coreDirectives() },] },
];
/** @nocollapse */
AgmCoreModule.ctorParameters = function () { return []; };
//# sourceMappingURL=core-module.js.map