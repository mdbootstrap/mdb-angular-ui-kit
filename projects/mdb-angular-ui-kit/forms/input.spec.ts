import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MdbFormsModule } from './index';

describe('MDB Checkbox', () => {
  let component: BasicInputComponent;
  let fixture: ComponentFixture<BasicInputComponent>;
  let input: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicInputComponent],
      imports: [MdbFormsModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(BasicInputComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.css('input'));
  });

  it('Should be disabled if disabled input is set to true', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(input.nativeElement.disabled).toBe(true);
  });

  it('Should be readonly if readonly input is set to true', () => {
    component.readonly = true;
    fixture.detectChanges();
    expect(input.nativeElement.hasAttribute('readonly')).toBe(true);
  });
});

const basicTemplate = `
  <input mdbInput [disabled]="disabled" [readonly]="readonly" class="form-check-input" />
`;

@Component({
  selector: 'mdb-input-test',
  template: basicTemplate,
})
class BasicInputComponent {
  disabled = false;
  readonly = false;
}
