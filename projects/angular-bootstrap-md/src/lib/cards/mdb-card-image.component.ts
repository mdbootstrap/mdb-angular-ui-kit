import { Component, Input } from '@angular/core';

@Component({
    selector: 'mdb-card-img',
    templateUrl: './mdb-card-image.component.html',
})

export class MdbCardImageComponent {

    @Input() src: string;
    @Input() alt: string;

}
