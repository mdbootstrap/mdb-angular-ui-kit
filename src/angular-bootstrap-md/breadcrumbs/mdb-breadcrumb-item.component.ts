import { Component, ElementRef, Renderer2, OnInit, Input } from '@angular/core';

@Component({
    selector: 'mdb-breadcrumb-item',
    templateUrl: './mdb-breadcrumb-item.component.html'
})
export class MdbBreadcrumbItemComponent implements OnInit {
    @Input() fontWeight: string;

    constructor(private _el: ElementRef, private _renderer: Renderer2) { }

    ngOnInit() {
      this._renderer.addClass(this._el.nativeElement, 'breadcrumb-item');
    }
}
