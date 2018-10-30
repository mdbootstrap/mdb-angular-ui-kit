import { TemplateRef, ViewContainerRef, EventEmitter, Renderer2, ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { TooltipConfig } from './tooltip.service';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
export declare class TooltipDirective implements OnInit, OnDestroy, OnChanges {
    /**
     * Content to be displayed as tooltip.
     */
    mdbTooltip: string | TemplateRef<any>;
    /** Fired when tooltip content changes */
    tooltipChange: EventEmitter<string | TemplateRef<any>>;
    /**
     * Placement of a tooltip. Accepts: "top", "bottom", "left", "right"
     */
    placement: string;
    /**
     * Specifies events that should trigger. Supports a space separated list of
     * event names.
     */
    triggers: string;
    /**
     * A selector specifying the element the tooltip should be appended to.
     * Currently only supports "body".
     */
    container: string;
    /**
     * Returns whether or not the tooltip is currently being shown
     */
    isOpen: boolean;
    /**
     * Allows to disable tooltip
     */
    isDisabled: boolean;
    /**
     * Emits an event when the tooltip is shown
     */
    onShown: EventEmitter<any>;
    shown: EventEmitter<any>;
    /**
     * Emits an event when the tooltip is hidden
     */
    onHidden: EventEmitter<any>;
    hidden: EventEmitter<any>;
    delay: number;
    fadeDuration: number;
    protected _delayTimeoutId: any;
    private _tooltip;
    constructor(_viewContainerRef: ViewContainerRef, _renderer: Renderer2, _elementRef: ElementRef, cis: ComponentLoaderFactory, config: TooltipConfig);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Toggles an element’s tooltip. This is considered a “manual” triggering of
     * the tooltip.
     */
    toggle(): void;
    /**
     * Opens an element’s tooltip. This is considered a “manual” triggering of
     * the tooltip.
     */
    show(): void;
    /**
     * Closes an element’s tooltip. This is considered a “manual” triggering of
     * the tooltip.
     */
    hide(): void;
    dispose(): void;
    ngOnDestroy(): void;
}
