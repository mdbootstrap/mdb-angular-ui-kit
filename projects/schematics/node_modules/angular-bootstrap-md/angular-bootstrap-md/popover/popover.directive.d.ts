import { EventEmitter, OnInit, OnDestroy, Renderer2, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { PopoverConfig } from './popover.config';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
/**
 * A lightweight, extensible directive for fancy popover creation.
 */
export declare class PopoverDirective implements OnInit, OnDestroy {
    /**
     * Content to be displayed as popover.
     */
    mdbPopover: string | TemplateRef<any>;
    /**
     * Title of a popover.
     */
    mdbPopoverHeader: string;
    popoverTitle: string;
    /**
     * Placement of a popover. Accepts: "top", "bottom", "left", "right"
     */
    placement: 'top' | 'bottom' | 'left' | 'right';
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
     * Returns whether or not the popover is currently being shown
     */
    isOpen: boolean;
    /**
     * Emits an event when the popover is shown
     */
    onShown: EventEmitter<any>;
    shown: EventEmitter<any>;
    /**
     * Emits an event when the popover is hidden
     */
    onHidden: EventEmitter<any>;
    hidden: EventEmitter<any>;
    private _popover;
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _viewContainerRef: ViewContainerRef, _config: PopoverConfig, cis: ComponentLoaderFactory);
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    show(): void | any;
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    hide(): void;
    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    toggle(): void;
    ngOnInit(): any;
    dispose(): void;
    ngOnDestroy(): any;
}
