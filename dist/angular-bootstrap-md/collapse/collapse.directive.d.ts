import { ElementRef, EventEmitter, OnInit, Renderer2, AfterViewInit } from '@angular/core';
export declare class CollapseDirective implements OnInit, AfterViewInit {
    showBsCollapse: EventEmitter<any>;
    shownBsCollapse: EventEmitter<any>;
    hideBsCollapse: EventEmitter<any>;
    hiddenBsCollapse: EventEmitter<any>;
    /** This event fires as soon as content collapses */
    collapsed: EventEmitter<any>;
    /** This event fires as soon as content becomes visible */
    expanded: EventEmitter<any>;
    isExpanded: boolean;
    isCollapsed: boolean;
    isCollapse: boolean;
    isCollapsing: boolean;
    collapsing: boolean;
    collapse: boolean;
    animationTime: number;
    maxHeight: number;
    protected _el: ElementRef;
    protected _renderer: Renderer2;
    constructor(_el: ElementRef, _renderer: Renderer2);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    resize(): void;
    /** allows to manually toggle content visibility */
    toggle(event?: any): void;
    /** allows to manually hide content */
    hide(): void;
    /** allows to manually show collapsed content */
    show(): void;
}
