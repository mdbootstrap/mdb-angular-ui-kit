import { Directive, OnInit } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mdbDropdownToggle]',
  exportAs: 'mdbDropdownToggle',
})
// tslint:disable-next-line:component-class-suffix
export class MdbDropdownToggleDirective implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
