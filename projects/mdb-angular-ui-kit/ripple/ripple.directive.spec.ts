import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MdbRippleModule } from './ripple.module';

const template = `
  <button
    id="button"
    class="btn btn-primary"
    mdbRipple
    [rippleCentered]="rippleCentered"
    [rippleColor]="rippleColor"
    [rippleDuration]="rippleDuration"
    [rippleRadius]="rippleRadius"
    [rippleUnbound]="rippleUnbound">
    Button
  </button>
`;

@Component({
  selector: 'mdb-ripple-test',
  template,
})
class TestRippleComponent {
  rippleCentered = true;
  rippleColor = '';
  rippleDuration = '1s';
  rippleRadius = 100;
  rippleUnbound = false;
}

describe('MDB Ripple', () => {
  let fixture: ComponentFixture<TestRippleComponent>;
  let component: any;
  let button: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestRippleComponent],
      imports: [MdbRippleModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestRippleComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    button = document.querySelector('.btn');
  });

  it('should set class ripple-surface on element', () => {
    expect(button.classList.contains('ripple-surface')).toBe(true);
  });

  it('should create helper element on click', () => {
    button.click();

    fixture.detectChanges();
    expect(button.children[0]).not.toBe(null);
  });

  it('should add class ripple-wave on helper element', () => {
    button.click();

    fixture.detectChanges();

    expect(button.children[0]).not.toBe(null);
    expect(button.children[0].classList.contains('ripple-wave')).toBe(true);
  });

  it('should set class ripple-surface-unbound on wrapper if rippleUnbound option is true', () => {
    component.rippleUnbound = true;

    fixture.detectChanges();

    button.click();

    fixture.detectChanges();
    expect(button.classList.contains('ripple-surface-unbound')).toBe(true);
  });

  it('should remove helper after duration', fakeAsync(() => {
    button.click();

    fixture.detectChanges();

    let helper = button.children[0];

    expect(helper).not.toBe(null);

    tick(1000);

    helper = button.children[0];

    expect(helper).toBe(undefined);
  }));
});
