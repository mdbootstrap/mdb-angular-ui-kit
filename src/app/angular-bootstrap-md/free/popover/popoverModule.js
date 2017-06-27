import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentLoaderFactory } from '../utils/component-loader';
import { PositioningService } from '../utils/positioning';
import { PopoverConfig } from './popoverConfig';
import { PopoverDirective } from './popoverDirective';
import { PopoverContainerComponent } from './popoverContainerComponent';
var PopoverModule = (function () {
    function PopoverModule() {
    }
    PopoverModule.forRoot = function () {
        return {
            ngModule: PopoverModule,
            providers: [PopoverConfig, ComponentLoaderFactory, PositioningService]
        };
    };
    return PopoverModule;
}());
export { PopoverModule };
PopoverModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                declarations: [PopoverDirective, PopoverContainerComponent],
                exports: [PopoverDirective],
                entryComponents: [PopoverContainerComponent]
            },] },
];
/** @nocollapse */
PopoverModule.ctorParameters = function () { return []; };
//# sourceMappingURL=popoverModule.js.map