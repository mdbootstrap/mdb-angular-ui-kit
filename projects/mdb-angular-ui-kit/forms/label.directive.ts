import { Directive, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mdbLabel]',
  exportAs: 'mdbLabel',
})
// tslint:disable-next-line: component-class-suffix
export class MdbLabelDirective {
  constructor() {}
}
