import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdbValidationModule } from './validation.module';

const template = `
  <input class="input" mdbValidate [validateSuccess]="success" [validateError]="error"/>
`;

@Component({
  selector: 'mdb-collapse-test',
  template,
})
class TestValidateComponent {
  success = true;
  error = true;
}

describe('MDB Collapse', () => {
  let fixture: ComponentFixture<TestValidateComponent>;
  let element: any;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestValidateComponent],
      imports: [MdbValidationModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestValidateComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should add validation classes', () => {
    const input = fixture.nativeElement.querySelector('.input');
    expect(input.classList.contains('validate-success')).toBe(true);
    expect(input.classList.contains('validate-error')).toBe(true);
  });

  it('should only add validate-success class if validateError is set to false', () => {
    component.success = true;
    component.error = false;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.input');

    expect(input.classList.contains('validate-success')).toBe(true);
    expect(input.classList.contains('validate-error')).toBe(false);
  });

  it('should only add validate-error class if validateSuccess is set to false', () => {
    component.success = false;
    component.error = true;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.input');

    expect(input.classList.contains('validate-success')).toBe(false);
    expect(input.classList.contains('validate-error')).toBe(true);
  });
});
