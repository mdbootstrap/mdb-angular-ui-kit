import { NgModule } from '@angular/core';
import { ModalBackdropComponent } from './modalBackdropComponent';
import { ModalDirective } from './modalDirective';
import { PositioningService } from '../utils/positioning';
import { ComponentLoaderFactory } from '../utils/component-loader';
var ModalModule = (function () {
    function ModalModule() {
    }
    ModalModule.forRoot = function () {
        return { ngModule: ModalModule, providers: [ComponentLoaderFactory, PositioningService] };
    };
    return ModalModule;
}());
export { ModalModule };
ModalModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ModalBackdropComponent, ModalDirective],
                exports: [ModalBackdropComponent, ModalDirective],
                entryComponents: [ModalBackdropComponent]
            },] },
];
/** @nocollapse */
ModalModule.ctorParameters = function () { return []; };
//# sourceMappingURL=modalModule.js.map