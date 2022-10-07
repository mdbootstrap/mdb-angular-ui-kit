import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { MdbCheckboxModule } from './index';
import { By } from '@angular/platform-browser';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('MDB Checkbox', () => {
  let checkbox: BasicCheckboxComponent;
  let fixture: ComponentFixture<BasicCheckboxComponent>;
  let input: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasicCheckboxComponent,
        CheckboxWithNgModelComponent,
        CheckboxWithFormControlComponent,
      ],
      imports: [MdbCheckboxModule, FormsModule, ReactiveFormsModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(BasicCheckboxComponent);
    fixture.detectChanges();
    checkbox = fixture.componentInstance;
    input = fixture.nativeElement.querySelector('input');
  });

  it('should be checked if checked input is set to true', () => {
    checkbox.checked = true;
    fixture.detectChanges();
    expect(input.checked).toBe(true);
  });

  it('should be unchecked if checked input is set to false', () => {
    checkbox.checked = false;
    fixture.detectChanges();
    expect(input.checked).toBe(false);
  });

  it('should be disabled if disabled input is set to true', () => {
    checkbox.disabled = true;
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
  });

  it('should be enabled if disabled input is set to false', () => {
    checkbox.disabled = false;
    fixture.detectChanges();
    expect(input.disabled).toBe(false);
  });

  it('should toggle checked state when clicked', () => {
    checkbox.checked = false;
    fixture.detectChanges();
    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(true);

    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(false);
  });

  it('should not toggle checked state if element is disabled', () => {
    checkbox.checked = false;
    checkbox.disabled = true;
    fixture.detectChanges();

    expect(input.checked).toBe(false);

    input.click();
    fixture.detectChanges();

    expect(input.checked).toBe(false);
  });

  describe('Checkbox with ngModel', () => {
    let checkbox: CheckboxWithNgModelComponent;
    let fixture: ComponentFixture<CheckboxWithNgModelComponent>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxWithNgModelComponent);
      fixture.detectChanges();
      checkbox = fixture.componentInstance;
      input = fixture.nativeElement.querySelector('input');
    });

    // it('should use value from ngModel to set default checked state', () => {
    //   checkbox.checked = true;
    //   fixture.detectChanges();

    //   expect(input.checked).toBe(true);
    // });

    it('should update ngModel value when checked state change', () => {
      checkbox.checked = false;
      fixture.detectChanges();

      input.click();
      fixture.detectChanges();

      expect(checkbox.checked).toBe(true);
    });
  });

  describe('Checkbox with form control', () => {
    let checkbox: CheckboxWithFormControlComponent;
    let fixture: ComponentFixture<CheckboxWithFormControlComponent>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxWithFormControlComponent);
      fixture.detectChanges();
      checkbox = fixture.componentInstance;
      input = fixture.nativeElement.querySelector('input');
    });

    it('should use value from form control to set default checked state', () => {
      expect(input.checked).toBe(false);

      checkbox.control.setValue(true);
      fixture.detectChanges();

      expect(input.checked).toBe(true);
    });

    it('should update form control value when checked state change', () => {
      expect(checkbox.control.value).toBe(false);
      expect(input.checked).toBe(false);

      input.click();
      fixture.detectChanges();

      expect(input.checked).toBe(true);
      expect(checkbox.control.value).toBe(true);
    });

    it('should disable input when form control disable method is used', () => {
      expect(input.disabled).toBe(false);

      checkbox.control.disable();
      fixture.detectChanges();

      expect(input.disabled).toBe(true);
    });
  });
});

const basicTemplate = `
<div class="form-check">
  <input mdbCheckbox [checked]="checked" [disabled]="disabled" class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
  <label class="form-check-label" for="flexCheckDefault"> Default checkbox </label>
</div>
`;

@Component({
  template: basicTemplate,
})
class BasicCheckboxComponent {
  checked = false;
  disabled = false;
}

const ngModelTemplate = `
<div class="form-check">
  <input mdbCheckbox [(ngModel)]="checked" class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
  <label class="form-check-label" for="flexCheckDefault"> Default checkbox </label>
</div>
`;

@Component({
  template: ngModelTemplate,
})
class CheckboxWithNgModelComponent {
  checked = false;
  disabled = false;
}

const formControlTemplate = `
<div class="form-check">
  <input mdbCheckbox [formControl]="control" class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
  <label class="form-check-label" for="flexCheckDefault"> Default checkbox </label>
</div>
`;

@Component({
  template: formControlTemplate,
})
class CheckboxWithFormControlComponent {
  control = new UntypedFormControl(false);
}
