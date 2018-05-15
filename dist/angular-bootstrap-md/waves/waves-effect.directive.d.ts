import { ElementRef } from '@angular/core';
export declare class WavesDirective {
    el: ElementRef;
    constructor(el: ElementRef);
    click(event: any): void;
    removeRipple(button: any, ripple: any): void;
}
