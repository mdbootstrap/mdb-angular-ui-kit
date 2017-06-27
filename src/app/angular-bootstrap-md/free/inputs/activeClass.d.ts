import { ElementRef, Renderer } from '@angular/core';
export declare class ActiveDirective {
    renderer: Renderer;
    el: ElementRef;
    elLabel: ElementRef;
    elIcon: Element;
    constructor(el: ElementRef, renderer: Renderer);
    onClick(): void;
    onBlur(): void;
}
