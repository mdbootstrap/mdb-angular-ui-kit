import { NgModule } from "@angular/core";
import { RippleDirective } from './ripple-effect.component';
var rippleModule = (function () {
    function rippleModule() {
    }
    rippleModule.forRoot = function () {
        return { ngModule: rippleModule, providers: [] };
    };
    return rippleModule;
}());
export { rippleModule };
rippleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [RippleDirective],
                exports: [RippleDirective]
            },] },
];
/** @nocollapse */
rippleModule.ctorParameters = function () { return []; };
//# sourceMappingURL=rippleModule.js.map