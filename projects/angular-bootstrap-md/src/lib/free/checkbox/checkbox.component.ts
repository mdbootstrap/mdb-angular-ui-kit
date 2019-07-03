import {
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, timer } from 'rxjs';
import { take } from 'rxjs/operators';

export const CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

let defaultIdNumber = 0;

export class MdbCheckboxChange {
  element: CheckboxComponent;
  checked: boolean;
}

@Component({
  selector: 'mdb-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['checkbox-module.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CHECKBOX_VALUE_ACCESSOR],
})
export class CheckboxComponent implements OnInit, OnChanges {
  @ViewChild('input', { static: true }) inputEl: any;

  private defaultId = `mdb-checkbox-${++defaultIdNumber}`;

  @Input() class: string;
  @Input() id: string = this.defaultId;
  @Input() required: boolean;
  @Input() name: string;
  @Input() value: string;
  @Input() checked = false;
  @Input() filledIn = false;
  @Input() indeterminate = false;
  @Input() disabled: boolean;
  @Input() rounded = false;
  @Input() checkboxPosition = 'left';
  @Input() default = false;
  @Input() inline = false;
  @Input() tabIndex: number;

  @Output() change: EventEmitter<MdbCheckboxChange> = new EventEmitter<MdbCheckboxChange>();

  private checkboxClicked = new Subject<boolean>();

  constructor() {}

  @HostListener('click', ['$event'])
  onLabelClick(event: any) {
    event.stopPropagation();
    this.checkboxClicked.next(true);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.checkboxClicked.next(false);
  }

  ngOnInit() {
    if (this.indeterminate && !this.filledIn && !this.rounded) {
      this.inputEl.indeterminate = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('checked')) {
      this.checked = changes.checked.currentValue;
    }
  }

  get changeEvent() {
    const newChangeEvent = new MdbCheckboxChange();
    newChangeEvent.element = this;
    newChangeEvent.checked = this.checked;
    return newChangeEvent;
  }

  toggle() {
    if (this.disabled) {
      return;
    }

    this.checked = !this.checked;
    this.indeterminate = false;
    this.onChange(this.checked);
  }

  onCheckboxClick(event: any) {
    event.stopPropagation();
    this.toggle();
  }

  onCheckboxChange(event: any) {
    event.stopPropagation();
    timer(0).subscribe(() => this.change.emit(this.changeEvent));
  }

  onBlur() {
    this.checkboxClicked.pipe(take(1)).subscribe(val => {
      if (!val) {
        this.onTouched();
      }
    });
  }

  // Control Value Accessor Methods
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any) {
    this.value = value;
    this.checked = !!value;
  }

  registerOnChange(fn: (_: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
