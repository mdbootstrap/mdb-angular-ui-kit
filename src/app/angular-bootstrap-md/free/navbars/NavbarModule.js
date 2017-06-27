import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Navbars } from "./navbarComponent";
var NavbarModule = (function () {
    function NavbarModule() {
    }
    return NavbarModule;
}());
export { NavbarModule };
NavbarModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                declarations: [Navbars],
                exports: [Navbars]
            },] },
];
/** @nocollapse */
NavbarModule.ctorParameters = function () { return []; };
//# sourceMappingURL=NavbarModule.js.map