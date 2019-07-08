import { Component, Input, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { document } from './../utils/facade/browser';

@Component({
  selector: 'mdb-icon',
  templateUrl: './icon.component.html',
})
export class MdbIconComponent implements OnInit {
  @Input() icon: string;
  @Input() size: string;
  @Input() class: string;
  @Input() classInside: string;

  fab = false;
  far = false;
  fal = false;
  fas = true;

  sizeClass = '';

  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  ngOnInit() {
    if (this.size) {
      this.sizeClass = `fa-${this.size}`;
    }

    if (this._el.nativeElement.parentElement.classList.contains('md-form')) {
      this._renderer.addClass(this._el.nativeElement, 'prefix');
    }

    const classList = this._el.nativeElement.classList;
    this.fab = classList.contains('fab');
    this.far = classList.contains('far');
    this.fas = classList.contains('fas');
    this.fal = classList.contains('fal');

    const formWrapper =
      this._getClosestEl(this._el.nativeElement, '.md-form') ||
      this._getClosestEl(this._el.nativeElement, '.md-outline');

    if (formWrapper) {
      formWrapper.childNodes.forEach((el: any) => {
        if (el.tagName === 'INPUT') {
          this._renderer.listen(el, 'focus', () => {
            this._renderer.addClass(this._el.nativeElement, 'active');
          });
          this._renderer.listen(el, 'blur', () => {
            this._renderer.removeClass(this._el.nativeElement, 'active');
          });
        }
      });
    }
  }

  private _getClosestEl(el: any, selector: string) {
    for (; el && el !== document; el = el.parentNode) {
      if (el.matches && el.matches(selector)) {
        return el;
      }
    }
    return null;
  }
}
