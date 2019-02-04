
import { Component, Input } from '@angular/core';

@Component({
    selector: 'mdb-card-text',
    templateUrl: './mdb-card-text.component.html',
})

export class MdbCardTextComponent {

    @Input() class: string;
}
