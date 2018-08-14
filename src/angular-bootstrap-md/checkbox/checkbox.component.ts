import { Component, OnInit, forwardRef, ViewChild, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export const CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true
};

let defaultIdNumber = 0;

export class MdbCheckboxChange {
  element: CheckboxComponent;
  checked: boolean;
}

@Component({
  selector: 'mdb-checkbox',
  templateUrl: './checkbox.component.html',
  providers: [CHECKBOX_VALUE_ACCESSOR]
})
export class CheckboxComponent implements OnInit, OnChanges {
  @ViewChild('input') inputEl: any;

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


  constructor() { }


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
    this.change.emit(this.changeEvent);
  }

  // Control Value Accessor Methods
  onChange = (_: any) => { };
  onTouched = () => { };

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
