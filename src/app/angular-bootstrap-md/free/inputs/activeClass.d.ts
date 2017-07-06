import { ElementRef, Renderer, AfterViewInit } from '@angular/core';
export declare class ActiveDirective implements AfterViewInit {
    renderer: Renderer;
    el: ElementRef;
    elLabel: ElementRef;
    elIcon: Element;
    constructor(el: ElementRef, renderer: Renderer);
    onClick(): void;
    onBlur(): void;
    ngAfterViewInit(): void;
    private initComponent();
    private checkValue();
}
