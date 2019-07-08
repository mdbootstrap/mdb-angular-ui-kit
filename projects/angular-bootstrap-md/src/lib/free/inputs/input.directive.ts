import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  AfterViewInit,
  HostListener,
  PLATFORM_ID,
  Inject,
  AfterViewChecked,
} from '@angular/core';

@Directive({
  selector: '[mdbInput]',
})
// tslint:disable-next-line:directive-class-suffix
export class MdbInput implements AfterViewChecked, AfterViewInit {
  public elLabel: ElementRef | any = null;
  public elIcon: Element | any = null;
  element: any = null;
  @Input() focusCheckbox = true;
  @Input() focusRadio = true;

  isBrowser: any = false;
  isClicked = false;

  constructor(
    private el: ElementRef,
    private _renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('focus') onfocus() {
    try {
      this._renderer.addClass(this.elLabel, 'active');
      this.isClicked = true;
    } catch (error) {}
  }

  @HostListener('blur') onblur() {
    try {
      if (this.el.nativeElement.value === '') {
        this._renderer.removeClass(this.elLabel, 'active');
      }
      this.isClicked = false;
    } catch (error) {}
  }

  @HostListener('change') onchange() {
    try {
      this.checkValue();
    } catch (error) {}
  }

  @HostListener('input') oniput() {}

  @HostListener('keydown', ['$event']) onkeydown(event: any) {
    try {
      if (event.target.type === 'number') {
        if (event.shiftKey) {
          switch (event.keyCode) {
            case 38:
              event.target.value = +event.target.value + 10;
              break;
            case 40:
              event.target.value = +event.target.value - 10;
              break;
          }
        }
        if (event.altKey) {
          switch (event.keyCode) {
            case 38:
              event.target.value = +event.target.value + 0.1;
              break;
            case 40:
              event.target.value = +event.target.value - 0.1;
              break;
          }
        }
      }
    } catch (error) {}
    this.delayedResize();
  }
  @HostListener('cut') oncut() {
    try {
      setTimeout(() => {
        this.delayedResize();
      }, 0);
    } catch (error) {}
  }
  @HostListener('paste') onpaste() {
    try {
      setTimeout(() => {
        this.delayedResize();
      }, 0);
    } catch (error) {}
  }
  @HostListener('drop') ondrop() {
    try {
      setTimeout(() => {
        this.delayedResize();
      }, 0);
    } catch (error) {}
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      try {
        this.element = document.querySelector('.md-textarea-auto');
      } catch (error) {}
    }
    const type = this.el.nativeElement.type;
    if (this.focusCheckbox && type === 'checkbox') {
      this._renderer.addClass(this.el.nativeElement, 'onFocusSelect');
    }
    if (this.focusRadio && type === 'radio') {
      this._renderer.addClass(this.el.nativeElement, 'onFocusSelect');
    }
  }

  ngAfterViewChecked() {
    this.initComponent();
    this.checkValue();
  }

  resize() {
    if (this.el.nativeElement.classList.contains('md-textarea-auto')) {
      this._renderer.setStyle(this.el.nativeElement, 'height', 'auto');
      this._renderer.setStyle(
        this.el.nativeElement,
        'height',
        this.el.nativeElement.scrollHeight + 'px'
      );
    }
  }

  delayedResize() {
    setTimeout(() => {
      this.resize();
    }, 0);
  }

  public initComponent(): void {
    let inputId;
    let inputP;
    if (this.isBrowser) {
      try {
        inputId = this.el.nativeElement.id;
      } catch (err) {}

      try {
        inputP = this.el.nativeElement.parentNode;
      } catch (err) {}

      this.elLabel =
        inputP.querySelector('label[for="' + inputId + '"]') || inputP.querySelector('label');
      if (this.elLabel && this.el.nativeElement.value !== '') {
        this._renderer.addClass(this.elLabel, 'active');
      }
      this.elIcon = inputP.querySelector('i') || false;

      if (this.elIcon) {
        this._renderer.addClass(this.elIcon, 'active');
      }
    }
  }

  private checkValue(): void {
    let value = '';
    if (this.elLabel != null) {
      value = this.el.nativeElement.value || '';
      if (value === '') {
        this._renderer.removeClass(this.elLabel, 'active');
        if (this.elIcon) {
          this._renderer.removeClass(this.elIcon, 'active');
        }
      }
      if (
        (value === '' && this.isClicked) ||
        (value === '' && this.el.nativeElement.placeholder) ||
        (value === '' && this.el.nativeElement.attributes.placeholder)
      ) {
        this._renderer.addClass(this.elLabel, 'active');
      }
    }
  }
}
