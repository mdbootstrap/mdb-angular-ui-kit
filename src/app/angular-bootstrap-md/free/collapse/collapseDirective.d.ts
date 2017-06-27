import { ElementRef, EventEmitter, OnInit, Renderer } from '@angular/core';
export declare class CollapseDirective implements OnInit {
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
    protected _renderer: Renderer;
    constructor(_el: ElementRef, _renderer: Renderer);
    ngOnInit(): void;
    /** allows to manually toggle content visibility */
    toggle(): void;
    /** allows to manually hide content */
    hide(): void;
    /** allows to manually show collapsed content */
    show(): void;
}
