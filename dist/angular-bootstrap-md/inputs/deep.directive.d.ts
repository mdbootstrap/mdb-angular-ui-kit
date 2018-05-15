import { ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
export declare class DeepDirective implements AfterViewInit {
    private el;
    private renderer;
    constructor(el: ElementRef, renderer: Renderer2);
    ngAfterViewInit(): void;
}
