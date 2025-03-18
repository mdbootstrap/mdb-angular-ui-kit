import { Directive } from '@angular/core';

@Directive({
    selector: '[mdbDropdownToggle]',
    exportAs: 'mdbDropdownToggle',
    standalone: false
})
export class MdbDropdownToggleDirective {
  constructor() {}
}
