import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MdbFormsModule } from './index';
import { MdbFormControlComponent } from './form-control.component';

describe('MDB Form Control', () => {
  let fixture: ComponentFixture<BasicFormControlComponent>;
  let wrapper: DebugElement;
  let input: DebugElement;
  const labelGapPadding = 8;
  const labelScale = 0.8;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicFormControlComponent, WithoutLabelComponent],
      imports: [MdbFormsModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(BasicFormControlComponent);
    fixture.detectChanges();
    wrapper = fixture.debugElement.query(By.directive(MdbFormControlComponent));
    input = fixture.debugElement.query(By.css('input'));
  });

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 20 });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 20 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 20 });
  });

  it('should add outline class to the wrapper element', () => {
    fixture.detectChanges();
    expect(wrapper.nativeElement.classList.contains('form-outline')).toBe(true);
  });

  it('should toggle input active class on value change', () => {
    input.nativeElement.value = 'Test';
    fixture.detectChanges();
    expect(input.nativeElement.classList.contains('active')).toBe(true);
  });

  it('should set placeholder-active class on input if label is not defined', () => {
    const fixture = TestBed.createComponent(WithoutLabelComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');

    expect(input.classList).toContain('placeholder-active');
  });

  it('should set top border gap on component init if label is defined', fakeAsync(() => {
    const fixture = TestBed.createComponent(BasicFormControlComponent);
    fixture.detectChanges();

    flush();
    fixture.detectChanges();
    const labelWidth = fixture.nativeElement.querySelector('label').clientWidth;
    const middleNotch = fixture.nativeElement.querySelector('.form-notch-middle');
    const expectedBorderGap = labelWidth * labelScale + labelGapPadding + 'px';

    expect(middleNotch.style.width).toEqual(expectedBorderGap);
  }));
});

const basicTemplate = `
<mdb-form-control>
  <input mdbInput class="form-control" />
  <label mdbLabel class="form-label">Example label</label>
</mdb-form-control>
`;

@Component({
  template: basicTemplate,
})
class BasicFormControlComponent {}

const withoutLabelTemplate = `
<mdb-form-control>
  <input mdbInput class="form-control" />
</mdb-form-control>
`;

@Component({
  template: withoutLabelTemplate,
})
class WithoutLabelComponent {}
