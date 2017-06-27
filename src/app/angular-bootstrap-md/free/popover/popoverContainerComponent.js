import { ChangeDetectionStrategy, Input, Component } from '@angular/core';
import { PopoverConfig } from './popoverConfig';
import { isBs3 } from '../utils/ng2-bootstrap-config';
var PopoverContainerComponent = (function () {
    function PopoverContainerComponent(config) {
        Object.assign(this, config);
    }
    Object.defineProperty(PopoverContainerComponent.prototype, "isBs3", {
        get: function () {
            return isBs3();
        },
        enumerable: true,
        configurable: true
    });
    return PopoverContainerComponent;
}());
export { PopoverContainerComponent };
PopoverContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'popover-container',
                changeDetection: ChangeDetectionStrategy.OnPush,
                // tslint:disable-next-line
                host: {
                    '[class]': '"popover in popover-" + placement + " " + placement',
                    '[class.show]': '!isBs3',
                    role: 'tooltip'
                },
                template: "\n<div class=\"popover-arrow arrow\"></div>\n<h3 class=\"popover-title\" *ngIf=\"title\">{{title}}</h3><div class=\"popover-content\"><ng-content></ng-content></div>\n    "
            },] },
];
/** @nocollapse */
PopoverContainerComponent.ctorParameters = function () { return [
    { type: PopoverConfig, },
]; };
PopoverContainerComponent.propDecorators = {
    'placement': [{ type: Input },],
    'title': [{ type: Input },],
};
//# sourceMappingURL=popoverContainerComponent.js.map