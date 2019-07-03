import {
  Directive,
  ElementRef,
  HostBinding,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const RADIO_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => ButtonRadioDirective),
  multi: true,
};

/**
 * Create radio buttons or groups of buttons.
 * A value of a selected button is bound to a variable specified via ngModel.
 */
@Directive({ selector: '[mdbRadio]', providers: [RADIO_CONTROL_VALUE_ACCESSOR] })
export class ButtonRadioDirective implements ControlValueAccessor, OnInit {
  public onChange: any = Function.prototype;
  public onTouched: any = Function.prototype;

  radioElementsArray: Array<any> = [];
  /** Radio button value, will be set to `ngModel` */
  @Input() public mdbRadio: any;
  /** If `true` — radio button can be unchecked */
  @Input() public uncheckable: boolean;
  /** Current value of radio component or group */
  @Input() public value: any;

  protected el: ElementRef;

  @HostBinding('class.active')
  public get isActive(): boolean {
    return this.mdbRadio === this.value;
  }

  // @HostBinding('class.active')
  @HostListener('click', ['$event'])
  public onClick(event?: any): void {
    try {
      this.el.nativeElement.parentElement.childNodes.forEach((element: any) => {
        this.radioElementsArray.push(element);
      });
      this.radioElementsArray.forEach(element => {
        this.renderer.removeClass(element, 'active');
      });
      this.renderer.addClass(event.target, 'active');
    } catch (error) {}
    if (this.el.nativeElement.attributes.disabled) {
      return;
    }

    if (this.uncheckable && this.mdbRadio === this.value) {
      this.value = undefined;
    } else {
      this.value = this.mdbRadio;
    }

    this.onTouched();
    this.onChange(this.value);
  }

  public constructor(el: ElementRef, private renderer: Renderer2) {
    this.el = el;
  }

  public ngOnInit(): void {
    this.uncheckable = typeof this.uncheckable !== 'undefined';
  }

  public onBlur(): void {
    this.onTouched();
  }

  // ControlValueAccessor
  // model -> view
  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
