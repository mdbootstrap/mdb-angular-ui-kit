import { OnDestroy } from '@angular/core';
import { BsDropdownState } from './dropdown.state';
export declare class BsDropdownContainerComponent implements OnDestroy {
    private _state;
    isOpen: boolean;
    display: string;
    position: string;
    readonly direction: 'down' | 'up';
    private _subscription;
    constructor(_state: BsDropdownState);
    ngOnDestroy(): void;
}
