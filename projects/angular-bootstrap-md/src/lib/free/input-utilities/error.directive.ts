import {
  Input,
  HostBinding,
  OnInit,
  ElementRef,
  Renderer2,
  OnDestroy,
  ViewEncapsulation,
  Component,
} from '@angular/core';

let defaultIdNumber = 0;

@Component({
  selector: 'mdb-error',
  template: '<ng-content></ng-content>',
  styleUrls: ['./input-utilities-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class MdbErrorDirective implements OnInit, OnDestroy {
  @Input() id = `mdb-error-${defaultIdNumber++}`;

  @HostBinding('class.error-message') errorMsg = true;
  @HostBinding('attr.id') messageId = this.id;

  textareaListenFunction: Function;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private _getClosestEl(el: any, selector: string) {
    for (; el && el !== document; el = el.previousElementSibling) {
      if (el.matches(selector)) {
        return el;
      }
    }
    return null;
  }
  private _calculateMarginTop() {
    const parent = this.el.nativeElement.parentNode.querySelector('.form-check');
    const heightParent = parent ? parent.offsetHeight : null;
    if (heightParent) {
      const margin = heightParent / 12.5;
      this.el.nativeElement.style.top = `${heightParent + heightParent / margin}px`;
    }
  }
  ngOnInit() {
    const textarea = this._getClosestEl(this.el.nativeElement, '.md-textarea');
    this._calculateMarginTop();
    if (textarea) {
      let height = textarea.offsetHeight + 4 + 'px';
      this.renderer.setStyle(this.el.nativeElement, 'top', height);

      this.textareaListenFunction = this.renderer.listen(textarea, 'keyup', () => {
        height = textarea.offsetHeight + 4 + 'px';
        this.renderer.setStyle(this.el.nativeElement, 'top', height);
      });
    }
  }

  ngOnDestroy() {
    if (this.textareaListenFunction) {
      this.textareaListenFunction();
    }
  }
}
