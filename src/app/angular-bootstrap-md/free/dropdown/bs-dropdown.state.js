import { EventEmitter, Injectable } from '@angular/core';
var BsDropdownState = (function () {
    function BsDropdownState() {
        var _this = this;
        this.direction = 'down';
        this.isOpenChange = new EventEmitter();
        this.isDisabledChange = new EventEmitter();
        this.toggleClick = new EventEmitter();
        this.dropdownMenu = new Promise(function (resolve) {
            _this.resolveDropdownMenu = resolve;
        });
    }
    return BsDropdownState;
}());
export { BsDropdownState };
BsDropdownState.decorators = [
    { type: Injectable },
];
/** @nocollapse */
BsDropdownState.ctorParameters = function () { return []; };
//# sourceMappingURL=bs-dropdown.state.js.map