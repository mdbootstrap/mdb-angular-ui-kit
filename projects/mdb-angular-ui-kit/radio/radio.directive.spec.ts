import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MdbRadioModule } from './index';

describe('MDB Checkbox', () => {
  let component: BasicRadioComponent;
  let fixture: ComponentFixture<BasicRadioComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicRadioComponent],
      imports: [MdbRadioModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(BasicRadioComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.elementRef.nativeElement;
  });

  it('Should disable input element if disabled is set to true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input = nativeElement.querySelector('input');

    expect(input.hasAttribute('disabled')).toBe(true);
  });

  it('Should correctly update name attribute', () => {
    component.name = 'test name';
    fixture.detectChanges();

    const input = nativeElement.querySelector('input');

    expect(input.getAttribute('name')).toBe('test name');
  });

  it('Should correctly update input checked state', () => {
    component.checked = true;
    fixture.detectChanges();

    const input = nativeElement.querySelector('input');

    expect(input.checked).toBe(true);
  });
});

const basicTemplate = `
    <div class="form-check">
        <input
            mdbRadio
            [checked]="checked"
            [disabled]="disabled"
            [name]="name"
            class="form-check-input"
            type="radio"
            id="flexRadioDefault1"
        />
        <label class="form-check-label" for="flexRadioDefault1"> Default radio </label>
    </div>
`;

@Component({
  selector: 'mdb-radio-test',
  template: basicTemplate,
})
class BasicRadioComponent {
  checked = false;
  name = 'mdb-radio';
  disabled = false;
}
