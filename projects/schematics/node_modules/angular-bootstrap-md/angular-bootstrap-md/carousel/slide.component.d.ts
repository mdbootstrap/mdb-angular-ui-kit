import { OnDestroy, OnInit, ElementRef } from '@angular/core';
import { CarouselComponent } from './carousel.component';
export declare class SlideComponent implements OnInit, OnDestroy {
    carousel: CarouselComponent;
    /** Is current slide active */
    active: boolean;
    animated: boolean;
    directionNext: boolean;
    directionLeft: boolean;
    directionPrev: boolean;
    directionRight: boolean;
    /** Wraps element by appropriate CSS classes */
    el: ElementRef | any;
    constructor(carousel: CarouselComponent, el: ElementRef);
    /** Fires changes in container collection after adding a new slide instance */
    ngOnInit(): void;
    /** Fires changes in container collection after removing of this slide instance */
    ngOnDestroy(): void;
}
