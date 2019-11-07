import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mdbValidate]',
})
export class MdbValidateDirective implements OnInit {
  private _validate = true;
  private _validateSuccess = true;
  private _validateError = true;

  @Input() mdbValidate: boolean;
  @Input()
  get validate() {
    return this._validate;
  }
  set validate(value: boolean) {
    this._validate = value;
    this.updateErrorClass();
    this.updateSuccessClass();
  }

  @Input()
  get validateSuccess() {
    return this._validateSuccess;
  }
  set validateSuccess(value: boolean) {
    this._validateSuccess = value;
    this.updateSuccessClass();
  }

  @Input()
  get validateError() {
    return this._validateError;
  }
  set validateError(value: boolean) {
    this._validateError = value;
    this.updateErrorClass();
    this.updateSuccessClass();
  }

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  updateSuccessClass() {
    if (this.validate && this.validateSuccess) {
      this.renderer.addClass(this.el.nativeElement, 'validate-success');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'validate-success');
    }
  }

  updateErrorClass() {
    if (this.validate && this.validateError) {
      this.renderer.addClass(this.el.nativeElement, 'validate-error');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'validate-error');
    }
  }

  ngOnInit() {
    this.updateSuccessClass();
    this.updateErrorClass();
  }
}
