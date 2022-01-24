import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  Directive,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  Optional,
  Renderer2,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MdbAbstractFormControl } from './form-control';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbInput]',
  exportAs: 'mdbInput',
  providers: [{ provide: MdbAbstractFormControl, useExisting: MdbInputDirective }],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbInputDirective implements MdbAbstractFormControl<any>, DoCheck, AfterViewInit {
  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    @Optional() @Self() private _ngControl: NgControl
  ) {}

  readonly stateChanges: Subject<void> = new Subject<void>();

  private _focused = false;
  private _color = '';

  ngAfterViewInit() {
    this._color = getComputedStyle(this._elementRef.nativeElement).color;
    if (this._elementRef.nativeElement.type === 'date') {
      this._updateTextColorForDateType();
    }
  }

  private _currentNativeValue: any;

  @HostBinding('disabled')
  @Input('disabled')
  get disabled(): boolean {
    if (this._ngControl && this._ngControl.disabled !== null) {
      return this._ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Input('readonly')
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    if (value) {
      this._renderer.setAttribute(this._elementRef.nativeElement, 'readonly', '');
    } else {
      this._renderer.removeAttribute(this._elementRef.nativeElement, 'readonly');
    }
    this._readonly = coerceBooleanProperty(value);
  }
  private _readonly = false;

  @Input()
  get value(): string {
    return this._elementRef.nativeElement.value;
  }
  set value(value: string) {
    if (value !== this.value) {
      this._elementRef.nativeElement.value = value;
      this._value = value;
      this.stateChanges.next();
    }
  }
  private _value: any;

  private _updateTextColorForDateType() {
    const actualColor = getComputedStyle(this._elementRef.nativeElement).color;
    this._color = actualColor !== 'rgba(0, 0, 0, 0)' ? actualColor : this._color;

    const color = this.labelActive ? this._color : `transparent`;

    this._renderer.setStyle(this._elementRef.nativeElement, 'color', color);
  }

  @HostListener('focus')
  _onFocus(): void {
    this._focused = true;
    if (this._elementRef.nativeElement.type === 'date') {
      this._updateTextColorForDateType();
    }
    this.stateChanges.next();
  }

  @HostListener('blur')
  _onBlur(): void {
    this._focused = false;
    if (this._elementRef.nativeElement.type === 'date') {
      this._updateTextColorForDateType();
    }
    this.stateChanges.next();
  }

  ngDoCheck(): void {
    const value = this._elementRef.nativeElement.value;
    if (this._currentNativeValue !== value) {
      this._currentNativeValue = value;
      this.stateChanges.next();
    }
  }

  get hasValue(): boolean {
    return this._elementRef.nativeElement.value !== '';
  }

  get focused(): boolean {
    return this._focused;
  }

  get input(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }

  get labelActive(): boolean {
    return this.focused || this.hasValue;
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_readonly: BooleanInput;
}
