import { Directive, OnInit } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mdbDropdownMenu]',
  exportAs: 'mdbDropdownMenu',
})
// tslint:disable-next-line:component-class-suffix
export class MdbDropdownMenuDirective implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
