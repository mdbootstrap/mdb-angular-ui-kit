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
  OnInit,
  DoCheck
} from '@angular/core';

@Directive({
  selector: '[mdbInputDirective]'
})
export class MdbInputDirective implements AfterViewChecked, OnInit, AfterViewInit, DoCheck {
  public wrongTextContainer: any;
  public rightTextContainer: any;
  public el: ElementRef | any = null;
  public elLabel: ElementRef | any = null;
  public elIcon: Element | any = null;
  element: any = null;
  @Input('mdbInputDirective') mdbInputDirective: MdbInputDirective;
  @Input('placeholder') public placeholder: string;
  @Input('customRegex') customRegex: any;
  @Input('mdbValidate') mdbValidate = true;
  @Input('validateSuccess') validateSuccess = true;
  @Input('validateError') validateError = true;
  @Input('focusCheckbox') focusCheckbox = true;
  @Input('focusRadio') focusRadio = true;
  @Input() errorMessage: string;
  @Input() successMessage: string;

  isBrowser: any = false;
  isClicked = false;

  constructor(private _elRef: ElementRef, private _renderer: Renderer2, @Inject(PLATFORM_ID) platformId: string) {
    this.el = _elRef;
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('focus') onfocus() {
    try {
      this._renderer.addClass(this.elLabel, 'active');
      this.isClicked = true;
    } catch (error) {

    }
  }

  @HostListener('blur') onblur() {
    this.validationFunction();
    try {
      if (this.el.nativeElement.value === '') {
        this._renderer.removeClass(this.elLabel, 'active');
      }
      this.isClicked = false;
    } catch (error) {

    }

  }

  @HostListener('change') onchange() {
    try {
      this.checkValue();
    } catch (error) {

    }
  }

  @HostListener('input') oniput() {
    this.validationFunction();
  }

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
    } catch (error) { }
    this.delayedResize();
  }
  @HostListener('cut') oncut() {
    try {
      setTimeout(() => {
        this.delayedResize();
      }, 0);
    } catch (error) { }
  }
  @HostListener('paste') onpaste() {
    try {
      setTimeout(() => {
        this.delayedResize();
      }, 0);
    } catch (error) { }
  }
  @HostListener('drop') ondrop() {
    try {
      setTimeout(() => {
        this.delayedResize();
      }, 0);
    } catch (error) { }
  }

  ngOnInit() {
    // Inititalise a new <span> wrong/right elements and render it below the host component.
    if (this.mdbValidate) {
      this.wrongTextContainer = this._renderer.createElement('span');
      this._renderer.addClass(this.wrongTextContainer, 'inputVal');
      this._renderer.addClass(this.wrongTextContainer, 'text-danger');
      this._renderer.appendChild(this._elRef.nativeElement.parentElement, this.wrongTextContainer);
      const textWrong = this._elRef.nativeElement.getAttribute('data-error');
      this.wrongTextContainer.innerHTML = (textWrong ? textWrong : 'wrong');
      if (!textWrong) {
        this.wrongTextContainer.innerHTML = (this.errorMessage ? this.errorMessage : 'wrong');
      }
      this._renderer.setStyle(this.wrongTextContainer, 'visibility', 'hidden');

      this.rightTextContainer = this._renderer.createElement('span');
      this._renderer.addClass(this.rightTextContainer, 'inputVal');
      this._renderer.addClass(this.rightTextContainer, 'text-success');
      this._renderer.appendChild(this._elRef.nativeElement.parentElement, this.rightTextContainer);
      const textSuccess = this._elRef.nativeElement.getAttribute('data-success');
      this.rightTextContainer.innerHTML = (textSuccess ? textSuccess : 'success');
      if (!textSuccess) {
        this.rightTextContainer.innerHTML = (this.successMessage ? this.successMessage : 'success');
      }
      this._renderer.setStyle(this.rightTextContainer, 'visibility', 'hidden');
    }
  }

  ngDoCheck() {
    if (this.mdbValidate &&
      this._elRef.nativeElement.classList.contains('ng-valid') &&
      this._elRef.nativeElement.classList.contains('ng-dirty') &&
      !this._elRef.nativeElement.classList.contains('counter-success')) {
      this._renderer.addClass(this._elRef.nativeElement, 'counter-success');
      this._renderer.setStyle(this.wrongTextContainer, 'visibility', 'hidden');
      this._renderer.setStyle(this.rightTextContainer, 'visibility', 'visible');
      this._renderer.setStyle(this.rightTextContainer, 'top', this._elRef.nativeElement.offsetHeight + 'px');
      this._renderer.setStyle(this.wrongTextContainer, 'top', this._elRef.nativeElement.offsetHeight + 'px');
    }
    if (this.mdbValidate &&
      this._elRef.nativeElement.classList.contains('ng-invalid') &&
      this._elRef.nativeElement.classList.contains('ng-dirty') &&
      !this._elRef.nativeElement.classList.contains('counter-danger')) {
      this._renderer.addClass(this._elRef.nativeElement, 'counter-danger');
      this._renderer.setStyle(this.rightTextContainer, 'visibility', 'hidden');
      this._renderer.setStyle(this.wrongTextContainer, 'visibility', 'visible');
      this._renderer.setStyle(this.rightTextContainer, 'top', this._elRef.nativeElement.offsetHeight + 'px');
      this._renderer.setStyle(this.wrongTextContainer, 'top', this._elRef.nativeElement.offsetHeight + 'px');
    }
    if (this._elRef.nativeElement.classList.contains('ng-invalid') &&
      this._elRef.nativeElement.classList.contains('ng-pristine') &&
      this._elRef.nativeElement.classList.contains('ng-untouched') || this._elRef.nativeElement.disabled) {
      if (this._elRef.nativeElement.classList.contains('counter-success')) {
        this._renderer.removeClass(this._elRef.nativeElement, 'counter-success');
        this._renderer.setStyle(this.rightTextContainer, 'visibility', 'hidden');
      } else if (this._elRef.nativeElement.classList.contains('counter-danger')) {
        this._renderer.removeClass(this._elRef.nativeElement, 'counter-danger');
        this._renderer.setStyle(this.wrongTextContainer, 'visibility', 'hidden');
      }
    }
    if (!this.validateSuccess) {
      this._renderer.removeClass(this._elRef.nativeElement, 'counter-success');
      this._renderer.setStyle(this.rightTextContainer, 'display', 'none');
      if (this._elRef.nativeElement.classList.contains('ng-valid')) {
        this._renderer.removeClass(this._elRef.nativeElement, 'counter-danger');
      }
    }

    if (!this.validateError) {
      this._renderer.removeClass(this._elRef.nativeElement, 'counter-danger');
      this._renderer.setStyle(this.wrongTextContainer, 'display', 'none');
      if (this._elRef.nativeElement.classList.contains('ng-invalid')) {
        this._renderer.removeClass(this._elRef.nativeElement, 'counter-success');
      }
    }
  }

  validationFunction() {
    setTimeout(() => {
      if (this._elRef.nativeElement.classList.contains('ng-invalid')) {
        this._renderer.removeClass(this._elRef.nativeElement, 'counter-success');
        this._renderer.removeClass(this._elRef.nativeElement, 'counter-danger');
      }
      if (this._elRef.nativeElement.classList.contains('ng-touched') &&
        this._elRef.nativeElement.classList.contains('ng-invalid')) {
        if (this.mdbValidate) {
          this._renderer.addClass(this._elRef.nativeElement, 'counter-danger');
          this._renderer.setStyle(this.rightTextContainer, 'visibility', 'hidden');
          this._renderer.setStyle(this.wrongTextContainer, 'visibility', 'visible');
          this._renderer.setStyle(this.rightTextContainer, 'top', this._elRef.nativeElement.offsetHeight + 'px');
          this._renderer.setStyle(this.wrongTextContainer, 'top', this._elRef.nativeElement.offsetHeight + 'px');
        }
      } else if (this._elRef.nativeElement.classList.contains('ng-touched') &&
        this._elRef.nativeElement.classList.contains('ng-valid')) {
        if (this.mdbValidate) {
          this._renderer.addClass(this._elRef.nativeElement, 'counter-success');
          this._renderer.setStyle(this.rightTextContainer, 'visibility', 'visible');
          this._renderer.setStyle(this.wrongTextContainer, 'visibility', 'hidden');
          this._renderer.setStyle(this.rightTextContainer, 'top', this._elRef.nativeElement.offsetHeight + 'px');
          this._renderer.setStyle(this.wrongTextContainer, 'top', this._elRef.nativeElement.offsetHeight + 'px');
        }
      }
    }, 0);
  }
  ngAfterViewInit() {
    if (this.isBrowser) {
      try {
        this.element = document.querySelector('.md-textarea-auto');
      } catch (error) { }

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
    // tslint:disable-next-line:max-line-length
    /* if (this.el.nativeElement.tagName === 'MDB-COMPLETER' && this.el.nativeElement.getAttribute('ng-reflect-model') == null && !this.isClicked) {
        this._renderer.removeClass(this.elLabel, 'active');
    } */
  }

  resize() {
    try {
      this._renderer.setStyle(this.element, 'height', 'auto');
      this._renderer.setStyle(this.element, 'height', this.element.scrollHeight + 'px');
    } catch (error) { }

  }

  delayedResize() {
    setTimeout(this.resize(), 0);
  }

  public initComponent(): void {
    let inputId;
    let inputP;
    if (this.isBrowser) {
      try {
        inputId = this.el.nativeElement.id;
      } catch (err) { }

      try {
        inputP = this.el.nativeElement.parentNode;
      } catch (err) { }

      this.elLabel = inputP.querySelector('label[for="' + inputId + '"]') || inputP.querySelector('label');
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
        // tslint:disable-next-line:max-line-length
      } if (value === '' && this.isClicked ||
        value === '' && this.el.nativeElement.placeholder ||
        value === '' && this.el.nativeElement.attributes.placeholder
      ) {
        this._renderer.addClass(this.elLabel, 'active');
      }
      if (this.el.nativeElement.getAttribute('ng-reflect-model') != null) {
        // tslint:disable-next-line:max-line-length
        /* if (this.el.nativeElement.tagName === 'MDB-COMPLETER' && this.el.nativeElement.getAttribute('ng-reflect-model').length !== 0) {
            this._renderer.addClass(this.elLabel, 'active');
        } */
      }
    }
  }
}
