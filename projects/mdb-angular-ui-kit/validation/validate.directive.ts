import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbValidate]',
})
export class MdbValidateDirective implements OnInit {
  private _validate = true;
  private _validateSuccess = true;
  private _validateError = true;

  @Input()
  get mdbValidate(): boolean {
    return this._mdbValidate;
  }
  set mdbValidate(value: boolean) {
    this._mdbValidate = coerceBooleanProperty(value);
  }
  private _mdbValidate: boolean;

  @Input()
  get validate(): boolean {
    return this._validate;
  }
  set validate(value: boolean) {
    this._validate = coerceBooleanProperty(value);
    this.updateErrorClass();
    this.updateSuccessClass();
  }

  @Input()
  get validateSuccess(): boolean {
    return this._validateSuccess;
  }
  set validateSuccess(value: boolean) {
    this._validateSuccess = coerceBooleanProperty(value);
    this.updateSuccessClass();
  }

  @Input()
  get validateError(): boolean {
    return this._validateError;
  }
  set validateError(value: boolean) {
    this._validateError = coerceBooleanProperty(value);
    this.updateErrorClass();
    this.updateSuccessClass();
  }

  constructor(private renderer: Renderer2, private _elementRef: ElementRef) {}

  updateSuccessClass(): void {
    if (this.validate && this.validateSuccess) {
      this.renderer.addClass(this._elementRef.nativeElement, 'validate-success');
    } else {
      this.renderer.removeClass(this._elementRef.nativeElement, 'validate-success');
    }
  }

  updateErrorClass(): void {
    if (this.validate && this.validateError) {
      this.renderer.addClass(this._elementRef.nativeElement, 'validate-error');
    } else {
      this.renderer.removeClass(this._elementRef.nativeElement, 'validate-error');
    }
  }

  ngOnInit(): void {
    this.updateSuccessClass();
    this.updateErrorClass();
  }

  static ngAcceptInputType_mdbValidate: BooleanInput;
  static ngAcceptInputType_validate: BooleanInput;
  static ngAcceptInputType_validateSuccess: BooleanInput;
  static ngAcceptInputType_validateError: BooleanInput;
}
