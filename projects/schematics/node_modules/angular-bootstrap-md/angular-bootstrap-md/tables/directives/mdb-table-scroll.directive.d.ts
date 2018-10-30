import { ElementRef, Renderer2, OnInit } from '@angular/core';
export declare class MdbTableScrollDirective implements OnInit {
    private renderer;
    private el;
    scrollY: boolean;
    maxHeight: any;
    scrollX: boolean;
    maxWidth: any;
    constructor(renderer: Renderer2, el: ElementRef);
    wrapTableWithVerticalScrollingWrapper(tableWrapper: ElementRef): void;
    wrapTableWithHorizontalScrollingWrapper(tableWrapper: ElementRef): void;
    wrapTableWithHorizontalAndVerticalScrollingWrapper(tableWrapper: ElementRef): void;
    ngOnInit(): void;
}
