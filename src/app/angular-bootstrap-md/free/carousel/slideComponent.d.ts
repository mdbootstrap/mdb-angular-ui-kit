import { OnDestroy, OnInit, ElementRef } from '@angular/core';
import { CarouselComponent } from './carouselComponent';
export declare class SlideComponent implements OnInit, OnDestroy {
    /** Is current slide active */
    active: boolean;
    private animated;
    /** Wraps element by appropriate CSS classes */
    protected carousel: CarouselComponent;
    el: ElementRef;
    constructor(carousel: CarouselComponent, el: ElementRef);
    /** Fires changes in container collection after adding a new slide instance */
    ngOnInit(): void;
    /** Fires changes in container collection after removing of this slide instance */
    ngOnDestroy(): void;
}
