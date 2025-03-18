import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  DestroyRef,
  Directive,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  Renderer2,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MdbAbstractFormControl } from './form-control';
import { AutofillEvent, AutofillMonitor } from '@angular/cdk/text-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[mdbInput]',
    exportAs: 'mdbInput',
    providers: [{ provide: MdbAbstractFormControl, useExisting: MdbInputDirective }],
    standalone: false
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbInputDirective
  implements MdbAbstractFormControl<any>, DoCheck, AfterViewInit, OnDestroy
{
  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    @Optional() @Self() private _ngControl: NgControl,
    private _autofill: AutofillMonitor,
    private _destroyRef: DestroyRef
  ) {}

  readonly stateChanges: Subject<void> = new Subject<void>();

  private _focused = false;
  private _autofilled = false;
  private _color = '';

  ngAfterViewInit() {
    if (typeof getComputedStyle === 'function') {
      this._color = getComputedStyle(this._elementRef.nativeElement).color;

      if (this._hasTypeInterferingPlaceholder()) {
        this._updateTextColorForDateType();
      }
    }

    this._autofill.monitor(this.input).subscribe((event: AutofillEvent) => {
      this._autofilled = event.isAutofilled;
      this.stateChanges.next();
    });

    this.stateChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      if (this._hasTypeInterferingPlaceholder()) {
        this._updateTextColorForDateType();
      }
    });
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
    this.stateChanges.next();
  }

  @HostListener('blur')
  _onBlur(): void {
    this._focused = false;
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

  get autofilled(): boolean {
    return this._autofilled;
  }

  get input(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }

  get labelActive(): boolean {
    return this.focused || this.hasValue || this.autofilled;
  }

  private _hasTypeInterferingPlaceholder() {
    const typesArray = ['date', 'datetime-local', 'time', 'month', 'week'];
    return typesArray.includes(this._elementRef.nativeElement.type);
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_readonly: BooleanInput;

  ngOnDestroy(): void {
    this._autofill.stopMonitoring(this.input);
  }
}
