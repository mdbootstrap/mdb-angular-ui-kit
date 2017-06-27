import { Directive, ElementRef, EventEmitter, Host, HostListener, Input, Output } from "@angular/core";
import { NgModel } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { CompleterItem } from "../components/completerItemComponent";
import { CtrCompleter } from "./completerDirective";
import { isNil } from "../globals";



// keyboard events
const KEY_DW = 40;
const KEY_RT = 39;
const KEY_UP = 38;
const KEY_LF = 37;
const KEY_ES = 27;
const KEY_EN = 13;
const KEY_TAB = 9;

@Directive({
    selector: "[ctrInput]",
})
export class CtrInput {
    @Input("clearSelected") public clearSelected = false;
    @Input("clearUnselected") public clearUnselected = false;
    @Input("overrideSuggested") public overrideSuggested = false;
    @Input("fillHighlighted") public fillHighlighted = true;
    @Input("openOnFocus") public openOnFocus = false;

    @Output() public ngModelChange: EventEmitter<any> = new EventEmitter();

    private _searchStr = "";
    private _displayStr = "";
    private blurTimer: Subscription = null;

    constructor( @Host() private completer: CtrCompleter, private ngModel: NgModel, private el: ElementRef) {
        this.completer.selected.subscribe((item: CompleterItem) => {
            if (!item) {
                return;
            }
            if (this.clearSelected) {
                this.searchStr = "";
            } else {
                this.searchStr = item.title;
            }
            this.ngModelChange.emit(this.searchStr);
        });
        this.completer.highlighted.subscribe((item: CompleterItem) => {
            if (this.fillHighlighted) {
                if (item) {
                    this._displayStr = item.title;
                    this.ngModelChange.emit(item.title);
                } else {
                    this._displayStr = this.searchStr;
                    this.ngModelChange.emit(this.searchStr);
                }
            }
        });
        this.ngModel.valueChanges.subscribe(value => {
            if (!isNil(value) && this._displayStr !== value) {
                if (this.searchStr !== value) {
                    this.completer.search(value);
                }
                this.searchStr = value;
            }
        });
    }

    @HostListener("keyup", ["$event"])
    public keyupHandler(event: any) {
        if (event.keyCode === KEY_LF || event.keyCode === KEY_RT || event.keyCode === KEY_TAB) {
            // do nothing
            return;
        }

        if (event.keyCode === KEY_UP || event.keyCode === KEY_EN) {
            event.preventDefault();
        }
        else if (event.keyCode === KEY_DW) {
            event.preventDefault();

            this.completer.search(this.searchStr);
        }
        else if (event.keyCode === KEY_ES) {
            this.restoreSearchValue();
            this.completer.clear();
        }
        else {
            if (this.searchStr) {
                this.completer.open();
            }
        }
    }

    @HostListener("keydown", ["$event"])
    public keydownHandler(event: any) {
        if (event.keyCode === KEY_EN) {
            if (this.completer.hasHighlighted()) {
                event.preventDefault();
            }
            this.handleSelection();
        } else if (event.keyCode === KEY_DW) {
            event.preventDefault();
            this.completer.open();
            this.completer.nextRow();
        } else if (event.keyCode === KEY_UP) {
            event.preventDefault();
            this.completer.prevRow();
        } else if (event.keyCode === KEY_TAB) {
            this.handleSelection();
        } else if (event.keyCode === KEY_ES) {
            // This is very specific to IE10/11 #272
            // without this, IE clears the input text
            event.preventDefault();
        }
    }

    @HostListener("blur", ["$event"])
    public onBlur(event: any) {
        // Check if we need to cancel Blur for IE
        if (this.completer.isCancelBlur()) {
            setTimeout(
                () => {
                    // get the focus back
                    this.el.nativeElement.focus();
                },
                0
            );
            return;
        }
        this.blurTimer = Observable.timer(200).subscribe(
            () => {
                this.blurTimer.unsubscribe();
                this.blurTimer = null;
                if (this.overrideSuggested) {
                    this.completer.onSelected({ title: this.searchStr, originalObject: null });
                } else {
                    if (this.clearUnselected && !this.completer.hasSelected) {
                        this.searchStr = "";
                    } else {
                        this.restoreSearchValue();
                    }
                }
                this.completer.clear();
            }
        );
    }

    @HostListener("focus", ["$event"])
    public onfocus() {
        if (this.blurTimer) {
            this.blurTimer.unsubscribe();
            this.blurTimer = null;
        }
        if (this.openOnFocus) {
            this.completer.open();
        }
    }

    public get searchStr() {
        return this._searchStr;
    }

    public set searchStr(term: string) {
        this._searchStr = term;
        this._displayStr = term;
    }

    private handleSelection() {
        if (this.completer.hasHighlighted()) {
            this._searchStr = "";
            this.completer.selectCurrent();
        } else if (this.overrideSuggested) {
            this.completer.onSelected({ title: this.searchStr, originalObject: null });
        } else {
            this.completer.clear();
        }
    }

    private restoreSearchValue() {
        if (this.fillHighlighted) {
            if (this._displayStr != this.searchStr) {
                this._displayStr = this.searchStr;
                this.ngModelChange.emit(this.searchStr);
            }
        }
    }
}