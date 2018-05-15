import { ElementRef, Renderer, OnInit } from '@angular/core';
export declare class InputValidateDirective implements OnInit {
    private _elRef;
    private _renderer;
    value: string;
    minLength: string;
    maxLength: string;
    customRegex: any;
    wrongTextContainer: any;
    rightTextContainer: any;
    constructor(_elRef: ElementRef, _renderer: Renderer);
    ngOnInit(): void;
    onBlur(): void;
}
