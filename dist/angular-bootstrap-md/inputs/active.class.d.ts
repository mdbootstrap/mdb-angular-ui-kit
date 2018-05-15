import { ElementRef, Renderer2, AfterViewInit, AfterViewChecked } from '@angular/core';
export declare class ActiveDirective implements AfterViewInit, AfterViewChecked {
    renderer: Renderer2;
    isBrowser: any;
    mdbActive: ActiveDirective;
    isClicked: boolean;
    el: ElementRef | any;
    elLabel: ElementRef | any;
    elIcon: Element | any;
    constructor(el: ElementRef, renderer: Renderer2, platformId: string);
    onClick(): void;
    Click(): void;
    onBlur(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    private initComponent();
    private checkValue();
}
