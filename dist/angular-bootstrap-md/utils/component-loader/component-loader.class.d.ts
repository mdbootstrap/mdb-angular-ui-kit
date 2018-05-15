import { ApplicationRef, ComponentFactoryResolver, ComponentRef, ElementRef, EventEmitter, Injector, NgZone, Provider, Renderer2, TemplateRef, Type, ViewContainerRef } from '@angular/core';
import { PositioningOptions, PositioningService } from '../positioning/positioning.service';
export interface ListenOptions {
    target?: ElementRef;
    triggers?: string;
    show?: Function | any;
    hide?: Function | any;
    toggle?: Function;
}
export declare class ComponentLoader<T> {
    private _viewContainerRef;
    private _renderer;
    private _elementRef;
    private _injector;
    private _componentFactoryResolver;
    private _ngZone;
    private _applicationRef;
    private _posService;
    onBeforeShow: EventEmitter<any>;
    onShown: EventEmitter<any>;
    onBeforeHide: EventEmitter<any>;
    onHidden: EventEmitter<any>;
    instance: T;
    _componentRef: ComponentRef<T> | any;
    private _providers;
    private _componentFactory;
    private _zoneSubscription;
    private _contentRef;
    private _innerComponent;
    private _unregisterListenersFn;
    readonly isShown: boolean;
    /**
     * Placement of a component. Accepts: "top", "bottom", "left", "right"
     */
    private attachment;
    /**
     * A selector specifying the element the popover should be appended to.
     * Currently only supports "body".
     */
    private container;
    /**
     * Specifies events that should trigger. Supports a space separated list of
     * event names.
     */
    private triggers;
    /**
     * Do not use this directly, it should be instanced via
     * `ComponentLoadFactory.attach`
     * @internal
     */
    constructor(_viewContainerRef: ViewContainerRef, _renderer: Renderer2, _elementRef: ElementRef, _injector: Injector, _componentFactoryResolver: ComponentFactoryResolver, _ngZone: NgZone, _applicationRef: ApplicationRef, _posService: PositioningService);
    attach(compType: Type<T>): ComponentLoader<T>;
    to(container?: string): ComponentLoader<T>;
    position(opts?: PositioningOptions | any): ComponentLoader<T>;
    provide(provider: Provider): ComponentLoader<T>;
    show(opts?: {
        content?: string | TemplateRef<any>;
        [key: string]: any;
    }): ComponentRef<T>;
    hide(): ComponentLoader<T>;
    toggle(): void | any;
    dispose(): void;
    listen(listenOpts: ListenOptions): ComponentLoader<T>;
    getInnerComponent(): ComponentRef<T>;
    private _subscribePositioning();
    private _unsubscribePositioning();
    private _getContentRef(content);
}
