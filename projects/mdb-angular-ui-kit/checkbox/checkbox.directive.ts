import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Directive,
  HostBinding,
  HostListener,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export const MDB_CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => MdbCheckboxDirective),
  multi: true,
};

export class MdbCheckboxChange {
  element: MdbCheckboxDirective;
  checked: boolean;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbCheckbox]',
  providers: [MDB_CHECKBOX_VALUE_ACCESSOR],
})
export class MdbCheckboxDirective {
  @Input('checked')
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    this._checked = coerceBooleanProperty(value);
  }
  private _checked = false;

  @Input('value')
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    this._value = value;
  }
  private _value: any = null;

  @Input('disabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Output() checkboxChange: EventEmitter<MdbCheckboxChange> = new EventEmitter<MdbCheckboxChange>();

  @HostBinding('disabled')
  get isDisabled(): boolean {
    return this._disabled;
  }

  @HostBinding('checked')
  get isChecked(): boolean {
    return this._checked;
  }

  @HostListener('click')
  onCheckboxClick(): void {
    this.toggle();
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  constructor() {}

  get changeEvent(): MdbCheckboxChange {
    const newChangeEvent = new MdbCheckboxChange();
    newChangeEvent.element = this;
    newChangeEvent.checked = this.checked;
    return newChangeEvent;
  }

  toggle(): void {
    if (this.disabled) {
      return;
    }
    this._checked = !this._checked;
    this.onChange(this.checked);
    this.onCheckboxChange();
  }

  onCheckboxChange(): void {
    this.checkboxChange.emit(this.changeEvent);
  }

  // Control Value Accessor Methods
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
    this.checked = !!value;
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  static ngAcceptInputType_checked: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
}
