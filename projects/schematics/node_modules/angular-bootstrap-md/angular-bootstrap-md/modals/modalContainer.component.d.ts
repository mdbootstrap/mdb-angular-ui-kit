import { ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ModalOptions } from './modal.options';
export declare class ModalContainerComponent implements OnInit, OnDestroy {
    private _renderer;
    tabindex: number;
    role: string;
    modla: boolean;
    private mdbModalService;
    config: ModalOptions;
    isShown: boolean;
    level: number;
    isAnimated: boolean;
    protected _element: ElementRef;
    private isModalHiding;
    onClick(event: any): void;
    onEsc(): void;
    constructor(options: ModalOptions, _element: ElementRef, _renderer: Renderer2);
    ngOnInit(): void;
    ngOnDestroy(): void;
    hide(): void;
}
