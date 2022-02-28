import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { MdbCheckboxModule } from './index';
import { By } from '@angular/platform-browser';

describe('MDB Checkbox', () => {
  let checkbox: BasicCheckboxComponent;
  let fixture: ComponentFixture<BasicCheckboxComponent>;
  let element: HTMLElement;
  let checkboxInput: DebugElement;
  let checkboxLabel: DebugElement;
  let checkboxWrapper: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicCheckboxComponent],
      imports: [MdbCheckboxModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(BasicCheckboxComponent);
    checkbox = fixture.componentInstance;
    element = fixture.elementRef.nativeElement;
    checkboxInput = fixture.debugElement.query(By.css('input'));
    checkboxLabel = fixture.debugElement.query(By.css('label'));
    checkboxWrapper = fixture.debugElement.query(By.css('.form-check'));
  });

  it('Should be checked if checked input is set to true', () => {
    checkbox.checked = true;
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.checked).toBe(true);
  });

  it('Should be unchecked if checked input is set to false', () => {
    checkbox.checked = false;
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.checked).toBe(false);
  });

  it('Should be disabled if disabled input is set to true', () => {
    checkbox.disabled = true;
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.disabled).toBe(true);
  });

  it('Should be enabled if disabled input is set to false', () => {
    checkbox.disabled = false;
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.disabled).toBe(false);
  });

  it('Should toggle checked state when clicked', () => {
    checkbox.checked = false;
    fixture.detectChanges();
    checkboxInput.nativeElement.click();
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.checked).toBe(true);

    checkboxInput.nativeElement.click();
    fixture.detectChanges();
    expect(checkboxInput.nativeElement.checked).toBe(false);
  });
});

const basicTemplate = `
<div class="form-check">
  <input [checked]="checked" [disabled]="disabled" class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
  <label class="form-check-label" for="flexCheckDefault"> Default checkbox </label>
</div>
`;

@Component({
  selector: 'mdb-checkbox-test',
  template: basicTemplate,
})
class BasicCheckboxComponent {
  checked = false;
  disabled = false;
}
