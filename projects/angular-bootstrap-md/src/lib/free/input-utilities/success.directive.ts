import {
  Input,
  HostBinding,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Utils } from '../utils';

let defaultIdNumber = 0;

@Component({
  selector: 'mdb-success',
  template: '<ng-content></ng-content>',
  styleUrls: ['./input-utilities-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class MdbSuccessDirective implements OnInit, OnDestroy {
  prefix: HTMLElement;
  @Input() id = `mdb-success-${defaultIdNumber++}`;

  @HostBinding('class.success-message') successMsg = true;
  @HostBinding('attr.id') messageId = this.id;

  textareaListenFunction: Function;

  private utils: Utils = new Utils();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private _calculateMarginTop() {
    const parent = this.el.nativeElement.parentNode.querySelector('.form-check');
    const heightParent = parent ? parent.offsetHeight : null;
    if (heightParent) {
      const margin = heightParent / 12.5;
      this.el.nativeElement.style.top = `${heightParent + heightParent / margin}px`;
    }
  }

  ngOnInit() {
    this.prefix = this.el.nativeElement.parentNode.querySelector('.prefix');
    if (this.prefix) {
      this.prefix.classList.add('success-message');
    }

    const textarea = this.utils.getClosestEl(this.el.nativeElement, '.md-textarea');

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
    if (this.prefix) {
      this.prefix.classList.remove('success-message');
    }
  }
}
