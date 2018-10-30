import { OnDestroy, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { LinkedList } from '../utils/linked-list.class';
import { SlideComponent } from './slide.component';
import { CarouselConfig } from './carousel.config';
export declare enum Direction {
    UNKNOWN = 0,
    NEXT = 1,
    PREV = 2,
}
/**
* Base element to create carousel
*/
export declare class CarouselComponent implements OnDestroy, AfterViewInit {
    SWIPE_ACTION: {
        LEFT: string;
        RIGHT: string;
    };
    protected _slides: LinkedList<SlideComponent>;
    readonly slides: SlideComponent[];
    protected currentInterval: any;
    protected isPlaying: boolean;
    protected destroyed: boolean;
    protected el: ElementRef | any;
    protected animationEnd: boolean;
    isBrowser: any;
    /** If `true` — carousel will not cycle continuously and will have hard stops (prevent looping) */
    noWrap: boolean;
    /**  If `true` — will disable pausing on carousel mouse hover */
    noPause: boolean;
    isControls: boolean;
    keyboard: boolean;
    class: String;
    type: String;
    animation: String;
    activeSlideIndex: number;
    protected _currentActiveSlide: number | any;
    /** Will be emitted when active slide has been changed. Part of two-way-bindable [(activeSlide)] property */
    activeSlideChange: EventEmitter<any>;
    /** Index of currently displayed slide(started for 0) */
    activeSlide: number;
    protected _interval: number;
    checkNavigation(): boolean;
    checkDots(): boolean;
    getImg(slide: any): any;
    /**
     * Delay of item cycling in milliseconds. If false, carousel won't cycle automatically.
     */
    interval: number;
    readonly isBs4: boolean;
    constructor(config: CarouselConfig, el: ElementRef, platformId: string);
    ngOnDestroy(): void;
    /**
     * Adds new slide. If this slide is first in collection - set it as active and starts auto changing
     * @param slide
     */
    addSlide(slide: SlideComponent): void;
    ngAfterViewInit(): void;
    /**
     * Removes specified slide. If this slide is active - will roll to another slide
     * @param slide
     */
    removeSlide(slide: SlideComponent): void;
    swipe(action?: string): void;
    /**
     * Rolling to next slide
     * @param force: {boolean} if true - will ignore noWrap flag
     */
    nextSlide(force?: boolean): void;
    /**
     * Rolling to previous slide
     * @param force: {boolean} if true - will ignore noWrap flag
     */
    previousSlide(force?: boolean): void;
    protected fadeAnimation(goToIndex: number): void;
    protected slideAnimation(goToIndex: number, direction: any): void;
    /**
     * Rolling to specified slide
     * @param index: {number} index of slide, which must be shown
     */
    selectSlide(index: number): void;
    /**
     * Starts a auto changing of slides
     */
    play(): void;
    /**
     * Stops a auto changing of slides
     */
    pause(): void;
    /**
     * Finds and returns index of currently displayed slide
     */
    getCurrentSlideIndex(): number;
    /**
     * Defines, whether the specified index is last in collection
     */
    isLast(index: number): boolean;
    /**
     * Defines next slide index, depending of direction
     * @param direction: Direction(UNKNOWN|PREV|NEXT)
     * @param force: {boolean} if TRUE - will ignore noWrap flag, else will return undefined if next slide require wrapping
  
     */
    private findNextSlideIndex(direction, force);
    /**
     * Sets a slide, which specified through index, as active
     * @param index
     */
    private _select(index);
    /**
     * Starts loop of auto changing of slides
     */
    private restartTimer();
    /**
     * Stops loop of auto changing of slides
     */
    private resetTimer();
    protected hasClass(el: any, className: any): any;
    protected classAdd(el: any, className: any): void;
    protected removeClass(el: any, className: any): void;
    keyboardControl(event: KeyboardEvent): void;
    focus(): void;
}
