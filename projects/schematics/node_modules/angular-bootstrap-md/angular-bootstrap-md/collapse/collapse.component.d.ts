import { OnInit, EventEmitter } from '@angular/core';
export declare class CollapseComponent implements OnInit {
    isCollapsed: boolean;
    showBsCollapse: EventEmitter<any>;
    shownBsCollapse: EventEmitter<any>;
    hideBsCollapse: EventEmitter<any>;
    hiddenBsCollapse: EventEmitter<any>;
    collapsed: EventEmitter<any>;
    expanded: EventEmitter<any>;
    constructor();
    expandAnimationState: string;
    overflow: string;
    onExpandBodyDone(event: any): void;
    toggle(): void;
    show(): void;
    hide(): void;
    initializeCollapseState(): void;
    ngOnInit(): void;
}
