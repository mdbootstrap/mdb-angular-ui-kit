import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mdbRadio]',
})
export class MdbRadioDirective {
  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }
  private _name: string;

  @Input('checked')
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    this._checked = value;
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
    this._disabled = value;
  }
  private _disabled = false;

  @HostBinding('disabled')
  get isDisabled(): boolean {
    return this._disabled;
  }

  @HostBinding('checked')
  get isChecked(): boolean {
    return this._checked;
  }

  @HostBinding('attr.name')
  get nameAttr(): string {
    return this.name;
  }

  constructor() {}

  _updateName(value: string): void {
    this._name = value;
  }

  _updateChecked(value: boolean): void {
    this._checked = value;
  }

  _updateDisabledState(value: boolean): void {
    this._disabled = value;
  }
}
