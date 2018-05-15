import { ElementRef, Renderer2, AfterViewInit, AfterViewChecked, OnInit } from '@angular/core';
export declare class MdbInputDirective implements AfterViewChecked, OnInit, AfterViewInit {
    private renderer;
    mdbInputDirective: MdbInputDirective;
    placeholder: string;
    minLength: string;
    maxLength: string;
    customRegex: any;
    mdbValidate: boolean;
    focusCheckbox: boolean;
    focusRadio: boolean;
    isBrowser: any;
    isClicked: boolean;
    wrongTextContainer: any;
    rightTextContainer: any;
    el: ElementRef | any;
    elLabel: ElementRef | any;
    elIcon: Element | any;
    onfocus(): void;
    onBlur(): void;
    onchange(): void;
    constructor(el: ElementRef, renderer: Renderer2, platformId: string);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    initComponent(): void;
    private checkValue();
}
