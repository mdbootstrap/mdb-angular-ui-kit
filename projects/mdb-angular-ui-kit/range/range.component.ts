import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const RANGE_VALUE_ACCESOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => MdbRangeComponent),
  multi: true,
};
@Component({
  selector: 'mdb-range',
  templateUrl: 'range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RANGE_VALUE_ACCESOR],
})
export class MdbRangeComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('input') input: ElementRef;
  @ViewChild('thumb') thumb: ElementRef;
  @ViewChild('thumbValue') thumbValue: ElementRef;

  @Input() id: string;
  @Input() required: boolean;
  @Input() name: string;
  @Input() value: string;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled: boolean;

  @Input() label: string;
  @Input() min = 0;
  @Input() max = 100;
  @Input() step: number;

  @Input()
  get default(): boolean {
    return this._default;
  }
  set default(value: boolean) {
    this._default = value;
  }
  private _default: boolean;

  @Input() defaultRangeCounterClass: string;

  @Output() rangeValueChange = new EventEmitter<any>();

  public visibility = false;
  public thumbStyle: any;

  @HostListener('change', ['$event']) onchange(event: any): void {
    this.onChange(event.target.value);
  }

  @HostListener('input') onInput(): void {
    this.rangeValueChange.emit({ value: this.value });
    this.focusRangeInput();
  }

  constructor(private _cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.thumbPositionUpdate();
  }

  focusRangeInput(): void {
    this.input.nativeElement.focus();
    this.visibility = true;
  }

  blurRangeInput(): void {
    this.input.nativeElement.blur();
    this.visibility = false;
  }

  thumbPositionUpdate(): void {
    const rangeInput = this.input.nativeElement;
    const inputValue = rangeInput.value;
    const minValue = rangeInput.min ? rangeInput.min : 0;
    const maxValue = rangeInput.max ? rangeInput.max : 100;
    const newValue = Number(((inputValue - minValue) * 100) / (maxValue - minValue));

    this.value = inputValue;
    this.thumbStyle = { left: `calc(${newValue}% + (${8 - newValue * 0.15}px))` };
  }

  // Control Value Accessor Methods
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;

    this._cdRef.markForCheck();

    setTimeout(() => {
      this.thumbPositionUpdate();
    }, 0);
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

  static ngAcceptInputType_default: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
}
