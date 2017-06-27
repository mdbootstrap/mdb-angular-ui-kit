import { Directive, ElementRef, Host, HostListener, Input, Renderer, OnInit } from "@angular/core";

import { CompleterItem } from "../components/completerItemComponent";
import { CtrDropdown, CtrRowElement, CtrRowItem } from "./dropdownDirective";

@Directive({
    selector: "[ctrRow]",
})
export class CtrRow implements CtrRowElement, OnInit {

    private selected = false;
    private _rowIndex: number;
    private _item: CompleterItem;

    constructor(private el: ElementRef, private renderer: Renderer, @Host() private dropdown: CtrDropdown) { }

    public ngOnInit() {
        this.dropdown.registerRow(new CtrRowItem(this, this._rowIndex));
    }

    @Input()
    set ctrRow(index: number) {
        this._rowIndex = index;
    }

    @Input()
    set dataItem(item: CompleterItem) {
        this._item = item;
    }

    @HostListener("click", ["$event"]) public onClick(event: any) {
        this.dropdown.onSelected(this._item);
    }

    @HostListener("mouseenter", ["$event"]) public onMouseEnter(event: any) {
        this.dropdown.highlightRow(this._rowIndex);
    }

    public setHighlighted(selected: boolean) {
        this.selected = selected;
        this.renderer.setElementClass(this.el.nativeElement, "completer-selected-row", this.selected);
    }

    public getNativeElement() {
        return this.el.nativeElement;
    }

    public getDataItem() {
        return this._item;
    }
}