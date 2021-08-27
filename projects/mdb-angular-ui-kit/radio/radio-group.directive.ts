import {
  AfterContentInit,
  ContentChildren,
  Directive,
  forwardRef,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { from, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MdbRadioDirective } from './radio-button.directive';

export const MDB_RADIO_GROUP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => MdbRadioGroupDirective),
  multi: true,
};

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbRadioGroup]',
  providers: [MDB_RADIO_GROUP_VALUE_ACCESSOR],
})
export class MdbRadioGroupDirective implements ControlValueAccessor, AfterContentInit, OnDestroy {
  @ContentChildren(MdbRadioDirective, { descendants: true }) radios: QueryList<MdbRadioDirective>;

  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    this._value = value;
    if (this.radios) {
      this._updateChecked();
    }
  }
  private _value: any;

  @Input()
  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
    if (this.radios) {
      this._updateNames();
    }
  }
  private _name: string;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = disabled;

    if (this.radios) {
      this._updateDisabled();
    }
  }
  private _disabled = false;

  private _destroy$ = new Subject<void>();

  onChange = (_: any) => {};
  onTouched = () => {};

  ngAfterContentInit(): void {
    this._updateNames();
    this._updateDisabled();

    this.radios.changes
      .pipe(
        startWith(this.radios),
        switchMap((radios: QueryList<MdbRadioDirective>) => from(Promise.resolve(radios))),
        takeUntil(this._destroy$)
      )
      .subscribe(() => this._updateRadiosState());
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _updateRadiosState(): void {
    this._updateNames();
    this._updateChecked();
    this._updateDisabled();
  }

  private _updateNames(): void {
    this.radios.forEach((radio: MdbRadioDirective) => radio._updateName(this.name));
  }

  private _updateChecked(): void {
    this.radios.forEach((radio: MdbRadioDirective) => {
      const isChecked = radio.value === this._value;
      radio._updateChecked(isChecked);
    });
  }

  private _updateDisabled(): void {
    this.radios.forEach((radio: MdbRadioDirective) => radio._updateDisabledState(this._disabled));
  }

  // Control value accessor methods
  registerOnChange(fn: (value: any) => any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this._updateDisabled();
  }

  writeValue(value: any): void {
    this.value = value;
  }
}
