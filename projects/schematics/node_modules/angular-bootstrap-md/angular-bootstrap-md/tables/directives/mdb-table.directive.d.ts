import { OnInit, Renderer2, ElementRef } from '@angular/core';
export declare class MdbTableDirective implements OnInit {
    private el;
    private renderer;
    striped: boolean;
    bordered: boolean;
    borderless: boolean;
    hover: boolean;
    small: boolean;
    responsive: boolean;
    stickyHeader: boolean;
    stickyHeaderBgColor: string;
    stickyHeaderTextColor: string;
    constructor(el: ElementRef, renderer: Renderer2);
    ngOnInit(): void;
}
