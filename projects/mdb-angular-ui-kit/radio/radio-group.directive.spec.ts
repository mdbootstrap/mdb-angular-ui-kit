import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MdbRadioModule } from './index';

describe('MDB Checkbox', () => {
  let component: BasicRadioGroupComponent;
  let fixture: ComponentFixture<BasicRadioGroupComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicRadioGroupComponent],
      imports: [MdbRadioModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(BasicRadioGroupComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.elementRef.nativeElement;
  });

  it('Should disable all inputs if the group is disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const inputs = nativeElement.querySelectorAll('input');

    expect(inputs[0].disabled).toBe(true);
    expect(inputs[1].disabled).toBe(true);
  });

  it('Should set inputs name to the group name', () => {
    component.name = 'test name';
    fixture.detectChanges();
    const inputs = nativeElement.querySelectorAll('input');

    expect(inputs[0].getAttribute('name')).toBe('test name');
    expect(inputs[1].getAttribute('name')).toBe('test name');
  });
});

const basicTemplate = `
<div mdbRadioGroup [disabled]="disabled" [name]="name">
    <div class="form-check">
        <input
            mdbRadio
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
        />
        <label class="form-check-label" for="flexRadioDefault1"> Default radio </label>
    </div>

    <div class="form-check">
        <input
            mdbRadio
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
        />
        <label class="form-check-label" for="flexRadioDefault1"> Default radio </label>
    </div>
</div>
`;

@Component({
  selector: 'mdb-radio-group-test',
  template: basicTemplate,
})
class BasicRadioGroupComponent {
  checked = false;
  name = 'mdb-radio-group';
  disabled = false;
}
