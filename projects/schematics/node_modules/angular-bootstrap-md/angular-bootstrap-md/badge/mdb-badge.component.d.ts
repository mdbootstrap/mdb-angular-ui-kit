import { OnInit, ElementRef, Renderer2 } from '@angular/core';
export declare class MDBBadgeComponent implements OnInit {
    private _el;
    private _renderer;
    default: boolean;
    primary: boolean;
    success: boolean;
    info: boolean;
    warning: boolean;
    danger: boolean;
    pill: boolean;
    color: string;
    class: string;
    constructor(_el: ElementRef, _renderer: Renderer2);
    ngOnInit(): void;
}
