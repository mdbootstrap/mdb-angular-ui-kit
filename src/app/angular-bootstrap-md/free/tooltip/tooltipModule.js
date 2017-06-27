import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipContainerComponent } from './tooltipContainerComponent';
import { TooltipDirective } from './tooltipDirective';
import { TooltipConfig } from './tooltipConfig';
import { ComponentLoaderFactory } from '../utils/component-loader';
import { PositioningService } from '../utils/positioning';
var TooltipModule = (function () {
    function TooltipModule() {
    }
    TooltipModule.forRoot = function () {
        return {
            ngModule: TooltipModule,
            providers: [TooltipConfig, ComponentLoaderFactory, PositioningService]
        };
    };
    ;
    return TooltipModule;
}());
export { TooltipModule };
TooltipModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                declarations: [TooltipDirective, TooltipContainerComponent],
                exports: [TooltipDirective],
                entryComponents: [TooltipContainerComponent]
            },] },
];
/** @nocollapse */
TooltipModule.ctorParameters = function () { return []; };
//# sourceMappingURL=tooltipModule.js.map