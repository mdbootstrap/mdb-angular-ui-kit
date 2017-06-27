import { NgModule } from "@angular/core";
import { ActiveDirective } from './activeClass';
import { EqualValidator } from './equalValidatorDirective';
var activeModule = (function () {
    function activeModule() {
    }
    activeModule.forRoot = function () {
        return { ngModule: activeModule, providers: [] };
    };
    return activeModule;
}());
export { activeModule };
activeModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ActiveDirective, EqualValidator],
                exports: [ActiveDirective, EqualValidator]
            },] },
];
/** @nocollapse */
activeModule.ctorParameters = function () { return []; };
//# sourceMappingURL=activeModule.js.map