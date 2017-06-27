import { AfterViewInit, Directive, ElementRef, Host, HostListener, OnDestroy, OnInit } from "@angular/core";

import { CompleterItem } from "../components/completerItemComponent";
import { CtrCompleter, CompleterDropdown } from "./completerDirective";


export interface CtrRowElement {
    setHighlighted(selected: boolean): void;
    getNativeElement(): any;
    getDataItem(): CompleterItem;
}

export class CtrRowItem {
    constructor(public row: CtrRowElement, public index: number) { }
}

@Directive({
    selector: "[ctrDropdown]",
})
export class CtrDropdown implements CompleterDropdown, OnDestroy, OnInit, AfterViewInit {

    private rows: CtrRowItem[] = [];
    private currHighlighted: CtrRowItem;
    private isScrollOn: boolean;

    constructor( @Host() private completer: CtrCompleter, private el: ElementRef) {
        this.completer.registerDropdown(this);
    }

    public ngOnInit() {
        let css = getComputedStyle(this.el.nativeElement);
        this.isScrollOn = css.maxHeight && css.overflowY === "auto";
    }

    public ngOnDestroy() {
        this.completer.registerDropdown(null);
    }

    public ngAfterViewInit() {
        const autoHighlightIndex = this.completer.autoHighlightIndex;
        if (autoHighlightIndex) {
            setTimeout(
                () => {
                    this.highlightRow(autoHighlightIndex);
                },
                0
            );
        }
    }

    @HostListener("mousedown", ["$event"]) public onMouseDown(event: any) {
        // Support for canceling blur on IE (issue #158)
        this.completer.cancelBlur(true);
        setTimeout(
            () => {
                this.completer.cancelBlur(false);
            },
            0
        );
    }

    public registerRow(row: CtrRowItem) {
        this.rows.push(row);
    }

    public highlightRow(index: number) {

        const highlighted = this.rows.find(row => row.index === index);

        if (index < 0) {
            if (this.currHighlighted) {
                this.currHighlighted.row.setHighlighted(false);
            }
            this.currHighlighted = undefined;
            this.completer.onHighlighted(null);
            return;
        }

        if (!highlighted) {
            return;
        }

        if (this.currHighlighted) {
            this.currHighlighted.row.setHighlighted(false);
        }

        this.currHighlighted = highlighted;
        this.currHighlighted.row.setHighlighted(true);
        this.completer.onHighlighted(this.currHighlighted.row.getDataItem());

        if (this.isScrollOn && this.currHighlighted) {
            const rowTop = this.dropdownRowTop();
            if (rowTop < 0) {
                this.dropdownScrollTopTo(rowTop - 1);
            } else {
                const row = this.currHighlighted.row.getNativeElement();
                if (this.dropdownHeight() < row.getBoundingClientRect().bottom) {
                    this.dropdownScrollTopTo(this.dropdownRowOffsetHeight(row));
                    if (this.el.nativeElement.getBoundingClientRect().bottom - this.dropdownRowOffsetHeight(row) < row.getBoundingClientRect().top) {
                        this.dropdownScrollTopTo(row.getBoundingClientRect().top - (this.el.nativeElement.getBoundingClientRect().top + parseInt(getComputedStyle(this.el.nativeElement).paddingTop, 10)));
                    }
                }
            }
        }
    }

    public clear() {
        this.rows = [];
    }

    public onSelected(item: CompleterItem) {
        this.completer.onSelected(item);
    }

    public selectCurrent() {
        if (this.currHighlighted) {
            this.onSelected(this.currHighlighted.row.getDataItem());
        } else if (this.rows.length > 0) {
            this.onSelected(this.rows[0].row.getDataItem());
        }

    }

    public nextRow() {
        let nextRowIndex = 0;
        if (this.currHighlighted) {
            nextRowIndex = this.currHighlighted.index + 1;
        }
        this.highlightRow(nextRowIndex);
    }

    public prevRow() {
        let nextRowIndex = -1;
        if (this.currHighlighted) {
            nextRowIndex = this.currHighlighted.index - 1;
        }
        this.highlightRow(nextRowIndex);
    }

    private dropdownScrollTopTo(offset: any) {
        this.el.nativeElement.scrollTop = this.el.nativeElement.scrollTop + offset;
    }

    private dropdownRowTop() {
        return this.currHighlighted.row.getNativeElement().getBoundingClientRect().top -
            (this.el.nativeElement.getBoundingClientRect().top +
                parseInt(getComputedStyle(this.el.nativeElement).paddingTop, 10));
    }

    private dropdownHeight() {
        return this.el.nativeElement.getBoundingClientRect().top +
            parseInt(getComputedStyle(this.el.nativeElement).maxHeight, 10);
    }

    private dropdownRowOffsetHeight(row: any) {
        let css = getComputedStyle(row);
        return row.offsetHeight +
            parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
    }
}