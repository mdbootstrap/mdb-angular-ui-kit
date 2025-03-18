import { Directive, ElementRef } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[mdbLabel]',
    exportAs: 'mdbLabel',
    standalone: false
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbLabelDirective {
  constructor() {}
}
