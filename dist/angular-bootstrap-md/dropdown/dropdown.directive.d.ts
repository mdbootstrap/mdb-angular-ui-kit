import { ElementRef, EmbeddedViewRef, EventEmitter, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComponentLoader } from '../utils/component-loader/component-loader.class';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { BsDropdownConfig } from './dropdown.config';
import { BsDropdownContainerComponent } from './dropdown-container.component';
import { BsDropdownState } from './dropdown.state';
import { BsDropdownMenuDirective } from './dropdown-menu.directive';
export declare class BsDropdownDirective implements OnInit, OnDestroy {
    private _elementRef;
    private _renderer;
    private _viewContainerRef;
    private _cis;
    private _config;
    private _state;
    /**
     * Placement of a popover. Accepts: "top", "bottom", "left", "right"
     */
    placement: string;
    /**
     * Specifies events that should trigger. Supports a space separated list of
     * event names.
     */
    triggers: string;
    /**
     * A selector specifying the element the popover should be appended to.
     * Currently only supports "body".
     */
    container: string;
    /**
     * This attribute indicates that the dropdown should be opened upwards
     */
    dropup: boolean;
    /**
     * Indicates that dropdown will be closed on item or document click,
     * and after pressing ESC
     */
    autoClose: boolean;
    /**
     * Disables dropdown toggle and hides dropdown menu if opened
     */
    isDisabled: boolean;
    /**
     * Returns whether or not the popover is currently being shown
     */
    isOpen: boolean;
    /**
     * Emits an event when isOpen change
     */
    isOpenChange: EventEmitter<any>;
    /**
     * Emits an event when the popover is shown
     */
    onShown: EventEmitter<any>;
    /**
     * Emits an event when the popover is hidden
     */
    onHidden: EventEmitter<any>;
    readonly isBs4: boolean;
    _isInlineOpen: boolean;
    _showInline: boolean;
    _inlinedMenu: EmbeddedViewRef<BsDropdownMenuDirective>;
    _isDisabled: boolean;
    _dropdown: ComponentLoader<BsDropdownContainerComponent>;
    _subscriptions: Subscription[];
    _isInited: boolean;
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _viewContainerRef: ViewContainerRef, _cis: ComponentLoaderFactory, _config: BsDropdownConfig, _state: BsDropdownState);
    ngOnInit(): void;
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    show(): void;
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    hide(): void;
    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    toggle(value?: boolean): void;
    ngOnDestroy(): void;
}
