import { Directive, ElementRef, HostBinding, HostListener, Input, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { MdbAbstractFormControl } from './form-control';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mdbInput]',
  exportAs: 'mdbInput',
  providers: [{ provide: MdbAbstractFormControl, useExisting: MdbInputDirective }],
})
// tslint:disable-next-line: component-class-suffix
export class MdbInputDirective implements MdbAbstractFormControl<any> {
  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {}

  readonly stateChanges: Subject<void> = new Subject<void>();

  private _focused = false;

  @HostBinding('disabled')
  @Input('disabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
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
    this._readonly = value;
  }
  private _readonly = false;

  @Input()
  get value(): string {
    return this._elementRef.nativeElement.value;
  }
  set value(value: string) {
    if (value !== this.value) {
      this._elementRef.nativeElement.value = value;
      this.stateChanges.next();
    }
  }
  private _value: any;

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

  get hasValue(): boolean {
    return this._elementRef.nativeElement.value !== '';
  }

  get focused(): boolean {
    return this._focused;
  }

  get labelActive(): boolean {
    return this.focused || this.hasValue;
  }
}
