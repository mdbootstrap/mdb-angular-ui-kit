import {
  Component,
  Input,
  ElementRef,
  OnInit,
  Renderer2,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Utils } from '../utils';

@Component({
  selector: 'mdb-icon',
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbIconComponent implements OnInit {
  @Input() icon: string;
  @Input() size: string;
  @Input() class: string;
  @Input() classInside: string;

  fab = false;
  far = false;
  fal = false;
  fad = false;
  fas = true;

  sizeClass = '';

  utils: Utils = new Utils();

  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  ngOnInit() {
    if (this.size) {
      this.sizeClass = `fa-${this.size}`;
    }

    const classList = this._el.nativeElement.classList;
    this.fab = classList.contains('fab');
    this.far = classList.contains('far');
    this.fas = classList.contains('fas');
    this.fal = classList.contains('fal');
    this.fad = classList.contains('fad');

    const formWrapper =
      this.utils.getClosestEl(this._el.nativeElement, '.md-form') ||
      this.utils.getClosestEl(this._el.nativeElement, '.md-outline');

    if (formWrapper) {
      formWrapper.childNodes.forEach((el: any) => {
        if (el.tagName === 'INPUT' || 'TEXTAREA') {
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
}
