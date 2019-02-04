
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
    selector: 'mdb-card-title',
    templateUrl: './mdb-card-title.component.html',
})

export class MdbCardTitleComponent implements OnInit {

    constructor(private _el: ElementRef, private _r: Renderer2) {
        
    }

    ngOnInit() {
        this._r.addClass(this._el.nativeElement, 'card-title');
    }
}
