
import { Component, Input, ElementRef, Renderer2, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'mdb-card-body',
    templateUrl: './mdb-card-body.component.html',
    encapsulation: ViewEncapsulation.None
})

export class MdbCardBodyComponent implements OnInit {
    @Input() class: string;

    @Input() set cascade(cascade: boolean) {
        if (cascade) {
            this._r.addClass(this._el.nativeElement, 'card-body-cascade');
        }
    }

    constructor(private _el: ElementRef, private _r: Renderer2) {

    }

    ngOnInit() {
        this._r.addClass(this._el.nativeElement, 'card-body');
        if (this.class) {
            this.class.split(' ').forEach((element: any) => {
                this._r.addClass(this._el.nativeElement, element);
            });
        }
    }
}
