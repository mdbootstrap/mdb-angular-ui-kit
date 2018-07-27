import { Component, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
    selector: 'mdb-card-header',
    templateUrl: './mdb-card-header.component.html',
})

export class MdbCardHeaderComponent implements OnInit {
    @Input() class: string;
    constructor(private _el: ElementRef, private _r: Renderer2) { }

    ngOnInit() {
        this._r.addClass(this._el.nativeElement, 'card-header');
        if (this.class) {
            this.class.split(' ').forEach((element: any) => {
                this._r.addClass(this._el.nativeElement, element);
            });
        }
    }
}
