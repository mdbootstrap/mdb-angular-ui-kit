"use strict";
import { AfterViewChecked, Component, Input, Output, EventEmitter, OnInit, ViewChild, forwardRef, AfterViewInit, ElementRef } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";

import { CtrCompleter } from "../directives/completerDirective";
import { CompleterData } from "../services/completerDataService";
import { CompleterService } from "../services/completerService";
import { CompleterItem } from "./completerItemComponent";
import { MAX_CHARS, MIN_SEARCH_LENGTH, PAUSE, TEXT_SEARCHING, TEXT_NO_RESULTS } from "../globals";


import "rxjs/add/operator/catch";

const noop = () => { };

const COMPLETER_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CompleterCmp),
    multi: true
};


@Component({
    selector: "ng2-completer",
    template: `
        <div class="completer-holder md-form" ctrCompleter>
            
            <input #ctrInput [attr.id]="inputId.length > 0 ? inputId : null" type="search" class="completer-input form-control mdb-autocomplete" ctrInput [ngClass]="inputClass" 
                [(ngModel)]="searchStr" (ngModelChange)="onChange($event)" [attr.name]="inputName" [placeholder]="placeholder"
                [attr.maxlength]="maxChars" [tabindex]="fieldTabindex" [disabled]="disableInput" 
                [clearSelected]="clearSelected" [clearUnselected]="clearUnselected"
                [overrideSuggested]="overrideSuggested" [openOnFocus]="openOnFocus" [fillHighlighted]="fillHighlighted" 
                (blur)="onBlur()" (focus)="onFocus()" (keyup)="onKeyup($event)" (keydown)="onKeydown($event)"
                autocomplete="off" autocorrect="off" autocapitalize="off" />
            <label [ngClass]="{'active': focused}">{{ label }}</label>
            <div class="completer-dropdown-holder"
                *ctrList="dataService;
                    minSearchLength: minSearchLength;
                    pause: pause;
                    autoMatch: autoMatch;
                    initialValue: initialValue;
                    autoHighlight: autoHighlight;
                    let items = results;
                    let searchActive = searching;
                    let isInitialized = searchInitialized;
                    let isOpen = isOpen;">
                <div class="completer-dropdown" ctrDropdown *ngIf="isInitialized && isOpen && ((items.length > 0 || displayNoResults) || (searchActive && displaySearching))">
                    <div *ngIf="searchActive && displaySearching" class="completer-searching">{{_textSearching}}</div>
                    <div *ngIf="!searchActive && (!items || items.length === 0)" class="completer-no-results">{{_textNoResults}}</div>
                    <div class="completer-row-wrapper" *ngFor="let item of items; let rowIndex=index">
                        <div class="completer-row" [ctrRow]="rowIndex" [dataItem]="item">
                            <div *ngIf="item.image || item.image === ''" class="completer-image-holder">
                                <img *ngIf="item.image != ''" src="{{item.image}}" class="completer-image" />
                                <div *ngIf="item.image === ''" class="completer-image-default"></div>
                            </div>
                            <div class="completer-item-text" [ngClass]="{'completer-item-text-image': item.image || item.image === '' }">
                                <completer-list-item class="completer-title" [text]="item.title" [matchClass]="matchClass" [searchStr]="searchStr" [type]="'title'"></completer-list-item>
                                <completer-list-item *ngIf="item.description && item.description != ''" class="completer-description" [text]="item.description"
                                    [matchClass]="matchClass" [searchStr]="searchStr" [type]="'description'">
                                </completer-list-item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    providers: [COMPLETER_CONTROL_VALUE_ACCESSOR]
})
export class CompleterCmp implements OnInit, ControlValueAccessor, AfterViewChecked, AfterViewInit {
    @Input() public dataService: CompleterData;
    @Input() public inputName = "";
    @Input() public inputId: string = "";
    @Input() public pause = PAUSE;
    @Input() public minSearchLength = MIN_SEARCH_LENGTH;
    @Input() public maxChars = MAX_CHARS;
    @Input() public overrideSuggested = false;
    @Input() public clearSelected = false;
    @Input() public clearUnselected = false;
    @Input() public fillHighlighted = true;
    @Input() public placeholder = "";
    @Input() public matchClass: string;
    @Input() public fieldTabindex: number;
    @Input() public autoMatch = false;
    @Input() public disableInput = false;
    @Input() public inputClass: string;
    @Input() public autofocus = false;
    @Input() public openOnFocus = false;
    @Input() public initialValue: any;
    @Input() public autoHighlight = false;
    @Input() public label: string;

    public focused: boolean = false;


    @Output() public selected = new EventEmitter<CompleterItem>();
    @Output() public highlighted = new EventEmitter<CompleterItem>();
    @Output() public blur = new EventEmitter<void>();
    @Output("focus") public focusEvent = new EventEmitter<void>();
    @Output() public opened = new EventEmitter<boolean>();
    @Output() public keyup: EventEmitter<any> = new EventEmitter();
    @Output() public keydown: EventEmitter<any> = new EventEmitter();

    @ViewChild(CtrCompleter) public completer: CtrCompleter;
    @ViewChild("ctrInput") public ctrInput: ElementRef;

    public searchStr = "";
    public control = new FormControl("");

    private displaySearching = true;
    private displayNoResults = true;
    private _onTouchedCallback: () => void = noop;
    private _onChangeCallback: (_: any) => void = noop;
    private _focus: boolean = false;
    private _open: boolean = false;
    private _textNoResults = TEXT_NO_RESULTS;
    private _textSearching = TEXT_SEARCHING;

    constructor(private completerService: CompleterService) { }

    get value(): any { return this.searchStr; };

    set value(v: any) {
        if (v !== this.searchStr) {
            this.searchStr = v;
        }
        // Propagate the change in any case
        this._onChangeCallback(v);
    }

    public ngAfterViewInit() {
        if (this.autofocus) {
            this._focus = true;
        }
    }

    public ngAfterViewChecked(): void {
        if (this._focus) {
            this.ctrInput.nativeElement.focus();
            this._focus = false;
        }
    }

    public onTouched() {
        this._onTouchedCallback();
    }

    public writeValue(value: any) {
        this.searchStr = value;
    }

    public registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    public registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    @Input()
    public set datasource(source: CompleterData | string | Array<any>) {
        if (source) {
            if (source instanceof Array) {
                this.dataService = this.completerService.local(source);
            } else if (typeof (source) === "string") {
                this.dataService = this.completerService.remote(source);
            } else {
                this.dataService = source;
            }
        }
    }

    @Input()
    public set textNoResults(text: string) {
        if (this._textNoResults != text) {
            this._textNoResults = text;
            this.displayNoResults = this._textNoResults && this._textNoResults !== "false";
        }
    }

    @Input()
    public set textSearching(text: string) {
        if (this._textSearching != text) {
            this._textSearching = text;
            this.displaySearching = this._textSearching && this._textSearching !== "false";
        }
    }

    public ngOnInit() {
        this.completer.selected.subscribe((item: CompleterItem) => {
            this.selected.emit(item);
        });
        this.completer.highlighted.subscribe((item: CompleterItem) => {
            this.highlighted.emit(item);
        });
        this.completer.opened.subscribe((isOpen: boolean) => {
            this._open = isOpen;
            this.opened.emit(isOpen);
        });
    }

    public onBlur() {
        this.blur.emit();
        this.onTouched();
        if(this.searchStr === undefined || this.searchStr === "") {
            this.focused = false;
        }
    }

    public onFocus() {
        this.focusEvent.emit();
        this.onTouched();
        this.focused = true;
    }

    public onKeyup(event: any) {
        this.keyup.emit(event);
    }

    public onKeydown(event: any) {
        this.keydown.emit(event);
    }

    public onChange(value: string) {
        this.value = value;
    }

    public open() {
        this.completer.open();
    }

    public close() {
        this.completer.clear();
    }

    public focus(): void {
        if (this.ctrInput) {
            this.ctrInput.nativeElement.focus();
        } else {
            this._focus = true;
        }
    }

    public isOpen() {
        return this._open;
    }
}