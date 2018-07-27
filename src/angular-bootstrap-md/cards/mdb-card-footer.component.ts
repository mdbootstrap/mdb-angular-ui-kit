import { Component, Input, ElementRef, Renderer2, OnInit } from '@angular/core';

@Component({
    selector: 'mdb-card-footer',
    templateUrl: './mdb-card-footer.component.html',
})

export class MdbCardFooterComponent implements OnInit {
    @Input() class: string;
    constructor(private _el: ElementRef, private _r: Renderer2) { }

    ngOnInit() {
        // this._r.addClass(this._el.nativeElement, 'card-footer');
        if (this.class) {
            this.class.split(' ').forEach((element: any) => {
                this._r.addClass(this._el.nativeElement, element);
            });
        }
    }
}
