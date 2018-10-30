import { OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
export declare const CHECKBOX_VALUE_ACCESSOR: any;
export declare class MdbCheckboxChange {
    element: CheckboxComponent;
    checked: boolean;
}
export declare class CheckboxComponent implements OnInit, OnChanges {
    inputEl: any;
    private defaultId;
    class: string;
    id: string;
    required: boolean;
    name: string;
    value: string;
    checked: boolean;
    filledIn: boolean;
    indeterminate: boolean;
    disabled: boolean;
    rounded: boolean;
    checkboxPosition: string;
    default: boolean;
    inline: boolean;
    tabIndex: number;
    change: EventEmitter<MdbCheckboxChange>;
    constructor();
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    readonly changeEvent: MdbCheckboxChange;
    toggle(): void;
    onCheckboxClick(event: any): void;
    onCheckboxChange(event: any): void;
    onChange: (_: any) => void;
    onTouched: () => void;
    writeValue(value: any): void;
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
}
