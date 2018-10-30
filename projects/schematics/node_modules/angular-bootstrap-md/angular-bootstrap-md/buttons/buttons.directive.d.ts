import { Renderer2, ElementRef, OnInit } from '@angular/core';
export declare class MdbBtnDirective implements OnInit {
    private el;
    private renderer;
    color: string;
    rounded: boolean;
    gradient: string;
    outline: boolean;
    flat: boolean;
    size: string;
    block: boolean;
    floating: boolean;
    constructor(el: ElementRef, renderer: Renderer2);
    ngOnInit(): void;
}
