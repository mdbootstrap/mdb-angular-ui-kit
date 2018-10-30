import { ElementRef, Renderer2, OnInit } from '@angular/core';
export declare class MdbCardComponent implements OnInit {
    private _el;
    private _r;
    class: string;
    cascade: boolean;
    wider: boolean;
    narrower: boolean;
    reverse: boolean;
    dark: boolean;
    constructor(_el: ElementRef, _r: Renderer2);
    ngOnInit(): void;
}
