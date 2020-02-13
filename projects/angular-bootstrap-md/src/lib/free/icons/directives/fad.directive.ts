import { Directive, ElementRef, Renderer2 } from '@angular/core';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[fad], [duotone]' })
export class FadDirective {
  constructor(private _el: ElementRef, private _r: Renderer2) {
    this._r.addClass(this._el.nativeElement, 'fad');
  }
}
