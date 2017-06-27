import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { BsDropdownState } from './bs-dropdown.state';
var BsDropdownMenuDirective = (function () {
    function BsDropdownMenuDirective(_state, _viewContainer, _templateRef) {
        _state.resolveDropdownMenu({
            templateRef: _templateRef,
            viewContainer: _viewContainer
        });
    }
    return BsDropdownMenuDirective;
}());
export { BsDropdownMenuDirective };
BsDropdownMenuDirective.decorators = [
    { type: Directive, args: [{
                selector: '[bsDropdownMenu],[dropdownMenu]',
                exportAs: 'bs-dropdown-menu'
            },] },
];
/** @nocollapse */
BsDropdownMenuDirective.ctorParameters = function () { return [
    { type: BsDropdownState, },
    { type: ViewContainerRef, },
    { type: TemplateRef, },
]; };
//# sourceMappingURL=bs-dropdown-menu.directive.js.map