import { ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare const RADIO_CONTROL_VALUE_ACCESSOR: any;
/**
* Create radio buttons or groups of buttons.
* A value of a selected button is bound to a variable specified via ngModel.
*/
export declare class ButtonRadioDirective implements ControlValueAccessor, OnInit {
    private renderer;
    onChange: any;
    onTouched: any;
    radioElementsArray: Array<any>;
    /** Radio button value, will be set to `ngModel` */
    mdbRadio: any;
    /** If `true` — radio button can be unchecked */
    uncheckable: boolean;
    /** Current value of radio component or group */
    value: any;
    protected el: ElementRef;
    readonly isActive: boolean;
    onClick(event?: any): void;
    constructor(el: ElementRef, renderer: Renderer2);
    ngOnInit(): void;
    onBlur(): void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
}
