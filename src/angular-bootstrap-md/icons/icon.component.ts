import { Component, Input, ViewChild, ElementRef } from '@angular/core';


@Component({
    selector: 'mdb-icon',
    templateUrl: './icon.component.html'
})
export class MdbIconComponent {
    @ViewChild('iconEl') iconEl: ElementRef;
    @Input() icon: string;
    @Input() size: string;
    @Input() class: string;
}
