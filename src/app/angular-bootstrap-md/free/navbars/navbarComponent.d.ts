import { ElementRef, Renderer, AfterViewInit } from '@angular/core';
export declare class Navbars implements AfterViewInit {
    renderer: Renderer;
    SideClass: string;
    containerInside: boolean;
    shown: boolean;
    height: number;
    duration: number;
    collapse: boolean;
    showClass: boolean;
    collapsing: boolean;
    el: ElementRef;
    mobile: ElementRef;
    navbar: ElementRef;
    constructor(renderer: Renderer);
    ngAfterViewInit(): void;
    toggle(event: any): void;
    show(): void;
    hide(): void;
    readonly displayStyle: string;
    onResize(event: any): void;
}
