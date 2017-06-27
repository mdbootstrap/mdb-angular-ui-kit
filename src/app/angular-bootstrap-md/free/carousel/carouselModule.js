import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CarouselComponent } from './carouselComponent';
import { SlideComponent } from './slideComponent';
import { CarouselConfig } from './carouselConfig';
var CarouselModule = (function () {
    function CarouselModule() {
    }
    CarouselModule.forRoot = function () {
        return { ngModule: CarouselModule, providers: [] };
    };
    return CarouselModule;
}());
export { CarouselModule };
CarouselModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                declarations: [SlideComponent, CarouselComponent],
                exports: [SlideComponent, CarouselComponent],
                providers: [CarouselConfig]
            },] },
];
/** @nocollapse */
CarouselModule.ctorParameters = function () { return []; };
//# sourceMappingURL=carouselModule.js.map