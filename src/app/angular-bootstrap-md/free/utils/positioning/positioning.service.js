import { Injectable, ElementRef } from '@angular/core';
import { positionElements } from './ng-positioning';
var PositioningService = (function () {
    function PositioningService() {
    }
    PositioningService.prototype.position = function (options) {
        var element = options.element, target = options.target, attachment = options.attachment, appendToBody = options.appendToBody;
        positionElements(this._getHtmlElement(target), this._getHtmlElement(element), attachment, appendToBody);
    };
    PositioningService.prototype._getHtmlElement = function (element) {
        // it means that we got a selector
        if (typeof element === 'string') {
            return document.querySelector(element);
        }
        if (element instanceof ElementRef) {
            return element.nativeElement;
        }
        return element;
    };
    return PositioningService;
}());
export { PositioningService };
PositioningService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
PositioningService.ctorParameters = function () { return []; };
//# sourceMappingURL=positioning.service.js.map