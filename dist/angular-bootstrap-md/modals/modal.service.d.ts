import { ComponentRef, TemplateRef, EventEmitter, Renderer2, ViewContainerRef, ElementRef } from '@angular/core';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { ModalBackdropComponent } from './modalBackdrop.component';
import { MDBModalRef, ModalOptions } from './modal.options';
export declare class MDBModalService {
    private clf;
    private el;
    private v;
    private r;
    config: ModalOptions;
    onShow: EventEmitter<any>;
    onShown: EventEmitter<any>;
    onHide: EventEmitter<any>;
    onHidden: EventEmitter<any>;
    protected isBodyOverflowing: boolean;
    protected originalBodyPadding: number;
    protected scrollbarWidth: number;
    protected backdropRef: ComponentRef<ModalBackdropComponent> | any;
    private _backdropLoader;
    private modalsCount;
    private lastDismissReason;
    private loaders;
    constructor(clf: ComponentLoaderFactory, el: ElementRef, v: ViewContainerRef, r: Renderer2);
    /** Shows a modal */
    show(content: string | TemplateRef<any> | any, config?: any): MDBModalRef;
    hide(level: number): void;
    _showBackdrop(): void;
    _hideBackdrop(): void;
    _showModal(content: any): MDBModalRef;
    _hideModal(level: number): void;
    getModalsCount(): number;
    setDismissReason(reason: string): void;
    protected removeBackdrop(): void;
    /** AFTER PR MERGE MODAL.COMPONENT WILL BE USING THIS CODE*/
    /** Scroll bar tricks */
    /** @internal */
    checkScrollbar(): void;
    setScrollbar(): void;
    private resetScrollbar();
    private getScrollbarWidth();
    private _createLoaders();
    private removeLoaders(level);
    private copyEvent(from, to);
}
