import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TooltipConfig } from './tooltipConfig';
import { isBs3 } from '../utils/ng2-bootstrap-config';
var TooltipContainerComponent = (function () {
    function TooltipContainerComponent(config) {
        Object.assign(this, config);
    }
    Object.defineProperty(TooltipContainerComponent.prototype, "isBs3", {
        get: function () {
            return isBs3();
        },
        enumerable: true,
        configurable: true
    });
    TooltipContainerComponent.prototype.ngAfterViewInit = function () {
        this.classMap = { in: false, fade: false };
        this.classMap[this.placement] = true;
        this.classMap['tooltip-' + this.placement] = true;
        this.classMap.in = true;
        if (this.animation) {
            this.classMap.fade = true;
        }
        if (this.popupClass) {
            this.classMap[this.popupClass] = true;
        }
    };
    return TooltipContainerComponent;
}());
export { TooltipContainerComponent };
TooltipContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'bs-tooltip-container',
                changeDetection: ChangeDetectionStrategy.OnPush,
                // tslint:disable-next-line
                host: {
                    '[class]': '"tooltip in tooltip-" + placement + " " + placement',
                    '[class.show]': '!isBs3',
                    role: 'tooltip'
                },
                template: "\n    <div class=\"tooltip-arrow\"></div>\n    <div class=\"tooltip-inner\"><ng-content></ng-content></div>\n    "
                // template: `<div class="tooltip" role="tooltip"
                //    [ngStyle]="{top: top, left: left, display: display}"
                //    [ngClass]="classMap">
                //     <div class="tooltip-arrow"></div>
                //     <div class="tooltip-inner"
                //          *ngIf="htmlContent && !isTemplate"
                //          innerHtml="{{htmlContent}}">
                //     </div>
                //     <div class="tooltip-inner"
                //          *ngIf="htmlContent && isTemplate">
                //       <template [ngTemplateOutlet]="htmlContent"
                //                 [ngOutletContext]="{model: context}">
                //       </template>
                //     </div>
                //     <div class="tooltip-inner"
                //          *ngIf="content">
                //       {{content}}
                //     </div>
                //   </div>`
            },] },
];
/** @nocollapse */
TooltipContainerComponent.ctorParameters = function () { return [
    { type: TooltipConfig, },
]; };
//# sourceMappingURL=tooltipContainerComponent.js.map