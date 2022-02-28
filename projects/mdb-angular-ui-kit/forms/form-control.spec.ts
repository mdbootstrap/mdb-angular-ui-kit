import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MdbFormsModule } from './index';
import { MdbFormControlComponent } from './form-control.component';

describe('MDB Checkbox', () => {
  let component: BasicFormControlComponent;
  let fixture: ComponentFixture<BasicFormControlComponent>;
  let wrapper: DebugElement;
  let input: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicFormControlComponent],
      imports: [MdbFormsModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(BasicFormControlComponent);
    component = fixture.componentInstance;
    wrapper = fixture.debugElement.query(By.directive(MdbFormControlComponent));
    input = fixture.debugElement.query(By.css('input'));
  });

  it('Should add outline class to the wrapper element', () => {
    fixture.detectChanges();
    expect(wrapper.nativeElement.classList.contains('form-outline')).toBe(true);
  });

  it('Should toggle input active class on value change', () => {
    input.nativeElement.value = 'Test';
    fixture.detectChanges();
    expect(input.nativeElement.classList.contains('active')).toBe(true);
  });
});

const basicTemplate = `
<mdb-form-control>
  <input mdbInput [disabled]="disabled" [readonly]="readonly" class="form-check-input" />
  <label mdbLabel>Example label</label>
</mdb-form-control>
`;

@Component({
  selector: 'mdb-form-control-test',
  template: basicTemplate,
})
class BasicFormControlComponent {
  disabled = false;
  readonly = false;
}
