import { Injectable } from '@angular/core';
/** Default values provider for tooltip */
var TooltipConfig = (function () {
    function TooltipConfig() {
        /** tooltip placement, supported positions: 'top', 'bottom', 'left', 'right' */
        this.placement = 'top';
        /** array of event names which triggers tooltip opening */
        this.triggers = 'hover focus';
    }
    return TooltipConfig;
}());
export { TooltipConfig };
TooltipConfig.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TooltipConfig.ctorParameters = function () { return []; };
//# sourceMappingURL=tooltipConfig.js.map