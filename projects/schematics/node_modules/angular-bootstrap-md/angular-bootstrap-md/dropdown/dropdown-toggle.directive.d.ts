import { ElementRef, OnDestroy } from '@angular/core';
import { BsDropdownState } from './dropdown.state';
export declare class BsDropdownToggleDirective implements OnDestroy {
    private _state;
    private _element;
    private _subscriptions;
    ariaHaspopup: boolean;
    isDisabled: boolean | any;
    isOpen: boolean;
    onClick(): void;
    onDocumentClick(event: any): void;
    onEsc(): void;
    constructor(_state: BsDropdownState, _element: ElementRef);
    ngOnDestroy(): void;
}
