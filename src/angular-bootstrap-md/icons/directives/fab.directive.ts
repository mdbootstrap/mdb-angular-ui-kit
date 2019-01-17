import {Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({selector: '[fab], [brands]'})
export class FabDirective {
  constructor(private _el: ElementRef, private _r: Renderer2) {
    this._r.addClass(this._el.nativeElement, 'fab');
  }
}
