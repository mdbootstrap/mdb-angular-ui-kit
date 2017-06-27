import { Component, HostBinding, Input, ElementRef } from '@angular/core';
import { CarouselComponent } from './carouselComponent';
var SlideComponent = (function () {
    function SlideComponent(carousel, el) {
        this.animated = true;
        this.el = null;
        this.carousel = carousel;
        this.el = el;
    }
    /** Fires changes in container collection after adding a new slide instance */
    SlideComponent.prototype.ngOnInit = function () {
        this.carousel.addSlide(this);
    };
    /** Fires changes in container collection after removing of this slide instance */
    SlideComponent.prototype.ngOnDestroy = function () {
        this.carousel.removeSlide(this);
    };
    return SlideComponent;
}());
export { SlideComponent };
SlideComponent.decorators = [
    { type: Component, args: [{
                selector: 'slide',
                host: {
                    '[class.animated]': 'animated'
                },
                template: "\n    <ng-content></ng-content>\n  "
            },] },
];
/** @nocollapse */
SlideComponent.ctorParameters = function () { return [
    { type: CarouselComponent, },
    { type: ElementRef, },
]; };
SlideComponent.propDecorators = {
    'active': [{ type: HostBinding, args: ['class.active',] }, { type: Input },],
    'carousel': [{ type: HostBinding, args: ['class.carousel-item',] },],
};
//# sourceMappingURL=slideComponent.js.map