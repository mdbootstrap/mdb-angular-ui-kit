import { Directive, EventEmitter, Output } from "@angular/core";

import { CompleterItem } from "../components/completerItemComponent";

export interface CompleterList {
    search(term: string): void;
    open(): void;
    isOpen(open: boolean): void;
    clear(): void;
}

export interface CompleterDropdown {
    clear(): void;
    selectCurrent(): void;
    nextRow(): void;
    prevRow(): void;
}

@Directive({
    selector: "[ctrCompleter]",
})
export class CtrCompleter {
    @Output() public selected = new EventEmitter<CompleterItem>();
    @Output() public highlighted = new EventEmitter<CompleterItem>();
    @Output() public opened = new EventEmitter<boolean>();

    private list: CompleterList;
    private dropdown: CompleterDropdown;
    private _hasHighlighted = false;
    private _hasSelected = false;
    private _cancelBlur = false;
    private _isOpen = false;
    private _autoHighlightIndex: number;

    public registerList(list: CompleterList) {
        this.list = list;
    }

    public registerDropdown(dropdown: CompleterDropdown) {
        this.dropdown = dropdown;
    }

    public onHighlighted(item: CompleterItem) {
        this.highlighted.emit(item);
        this._hasHighlighted = !!item;
    }

    public onSelected(item: CompleterItem, clearList = true) {
        this.selected.emit(item);
        if (item) {
            this._hasSelected = true;
        }
        if (clearList) {
            this.clear();
        }
    }

    public search(term: string) {
        if (this._hasSelected) {
            this.selected.emit(null);
            this._hasSelected = false;
        }
        if (this.list) {
            this.list.search(term);
        }
    }

    public clear() {
        if (this.dropdown) {
            this.dropdown.clear();
        }
        if (this.list) {
            this.list.clear();
        }
        this._hasHighlighted = false;
        this.isOpen = false;
    }

    public selectCurrent() {
        if (this.dropdown) {
            this.dropdown.selectCurrent();
        }
    }

    public nextRow() {
        if (this.dropdown) {
            this.dropdown.nextRow();
        }
    }

    public prevRow() {
        if (this.dropdown) {
            this.dropdown.prevRow();
        }
    }

    public hasHighlighted() {
        return this._hasHighlighted;
    }

    public cancelBlur(cancel: boolean) {
        this._cancelBlur = cancel;
    }

    public isCancelBlur() {
        return this._cancelBlur;
    }

    public open() {
        if (!this._isOpen) {
            this.isOpen = true;
            this.list.open();
        }
    }

    public get isOpen() {
        return this._isOpen;
    }

    public set isOpen(open: boolean) {
        this._isOpen = open;
        this.opened.emit(this._isOpen);
        if (this.list) {
            this.list.isOpen(open);
        }
    }

    public get autoHighlightIndex() {
        return this._autoHighlightIndex;
    }

    public set autoHighlightIndex(index: number) {
        this._autoHighlightIndex = index;
    }

    public get hasSelected() {
        return this._hasSelected;
    }
}