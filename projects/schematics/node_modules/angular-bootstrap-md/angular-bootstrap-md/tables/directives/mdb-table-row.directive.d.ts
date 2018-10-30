import { EventEmitter, OnInit, OnDestroy, ElementRef } from '@angular/core';
export declare class MdbTableRowDirective implements OnInit, OnDestroy {
    private el;
    rowCreated: EventEmitter<any>;
    rowRemoved: EventEmitter<any>;
    constructor(el: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
