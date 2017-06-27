import { NgModule } from '@angular/core';
import { CollapseDirective } from './collapseDirective';
var CollapseModule = (function () {
    function CollapseModule() {
    }
    CollapseModule.forRoot = function () {
        return { ngModule: CollapseModule, providers: [] };
    };
    return CollapseModule;
}());
export { CollapseModule };
CollapseModule.decorators = [
    { type: NgModule, args: [{
                declarations: [CollapseDirective],
                exports: [CollapseDirective]
            },] },
];
/** @nocollapse */
CollapseModule.ctorParameters = function () { return []; };
//# sourceMappingURL=collapseModule.js.map