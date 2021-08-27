import { Directive } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbDropdownMenu]',
  exportAs: 'mdbDropdownMenu',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbDropdownMenuDirective {
  constructor() {}
}
