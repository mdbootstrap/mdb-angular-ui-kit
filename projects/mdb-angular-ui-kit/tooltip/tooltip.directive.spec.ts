import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MdbTooltipModule } from './index';
import { MdbTooltipDirective } from './tooltip.directive';
import { MdbTooltipComponent } from './tooltip.component';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MDB Tooltip', () => {
  describe('after init', () => {
    let fixture: ComponentFixture<TestTooltipComponent>;
    let element: any;
    let component: any;
    let directive: any;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MdbTooltipModule, NoopAnimationsModule],
        declarations: [TestTooltipComponent],
        teardown: { destroyAfterEach: false },
      }).overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [MdbTooltipComponent],
        },
      });
      fixture = TestBed.createComponent(TestTooltipComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should open tooltip after mouseenter and close after mouseout', () => {
      fixture.detectChanges();

      directive = fixture.debugElement
        .query(By.directive(MdbTooltipDirective))
        .injector.get(MdbTooltipDirective) as MdbTooltipDirective;

      const onOpen = jest.spyOn(directive, 'show');
      const onClose = jest.spyOn(directive, 'hide');

      const buttonEl = fixture.nativeElement.querySelector('button');

      buttonEl.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();

      expect(directive.show).toHaveBeenCalled();

      directive.open = true;
      buttonEl.dispatchEvent(new Event('mouseleave'));
      fixture.detectChanges();

      expect(directive.hide).toHaveBeenCalled();
    });

    it('should set tooltip title', () => {
      jest.useFakeTimers();
      const buttonEl = fixture.nativeElement.querySelector('button');

      buttonEl.dispatchEvent(new Event('mouseenter'));
      jest.runAllTimers();

      fixture.detectChanges();
      const tooltip = document.querySelector('.tooltip-inner');
      expect(tooltip.textContent).toMatch(component.testMdbTooltip);
    });

    it('should set placement', () => {
      jest.useFakeTimers();
      const buttonEl = fixture.nativeElement.querySelector('button');

      buttonEl.dispatchEvent(new Event('mouseenter'));
      jest.runAllTimers();

      fixture.detectChanges();
      directive = fixture.debugElement
        .query(By.directive(MdbTooltipDirective))
        .injector.get(MdbTooltipDirective) as MdbTooltipDirective;

      const placement = directive._overlayRef._config.positionStrategy._lastPosition.originY;
      expect(placement).toMatch('top');
    });
  });

  describe('onInit', () => {
    it('should open/close tooltip after click', () => {
      let fixture: ComponentFixture<TestTooltipComponent2>;
      let directive: any;
      let component: any;
      let element: any;

      TestBed.configureTestingModule({
        imports: [MdbTooltipModule],
        declarations: [TestTooltipComponent2],
        teardown: { destroyAfterEach: false },
      }).overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [MdbTooltipComponent],
        },
      });
      fixture = TestBed.createComponent(TestTooltipComponent2);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();

      directive = fixture.debugElement
        .query(By.directive(MdbTooltipDirective))
        .injector.get(MdbTooltipDirective) as MdbTooltipDirective;

      const onOpen = jest.spyOn(directive, 'show');
      const onClose = jest.spyOn(directive, 'hide');

      const buttonEl = fixture.nativeElement.querySelector('button');

      buttonEl.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(directive.show).toHaveBeenCalled();

      directive._open = true;
      buttonEl.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(directive.hide).toHaveBeenCalled();
    });
  });

  it('should prevent open', () => {
    let fixture: ComponentFixture<TestTooltipComponent3>;
    let directive: any;
    let component: any;
    let element: any;

    TestBed.configureTestingModule({
      imports: [MdbTooltipModule],
      declarations: [TestTooltipComponent3],
      teardown: { destroyAfterEach: false },
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [MdbTooltipComponent],
      },
    });
    fixture = TestBed.createComponent(TestTooltipComponent3);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();

    directive = fixture.debugElement
      .query(By.directive(MdbTooltipDirective))
      .injector.get(MdbTooltipDirective) as MdbTooltipDirective;

    const onOpen = jest.spyOn(directive, 'show');

    const buttonEl = fixture.nativeElement.querySelector('button');

    buttonEl.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(directive.show).not.toHaveBeenCalled();
  });
});

@Component({
  selector: 'mdb-test-tooltip',
  template: ` <button
    [trigger]="testTrigger"
    [mdbTooltip]="testMdbTooltip"
    [placement]="testPlacement"
    [disabled]="testDisabled"
  >
    MDB Button
  </button>`,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class TestTooltipComponent {
  testTrigger = 'hover';
  testMdbTooltip = 'tooltipTitle';
  testPlacement = 'top';
  testDisabled = false;
}

@Component({
  selector: 'mdb-test-tooltip2',
  template: ` <button mdbTooltip="testMdbTooltip" trigger="click">MDB Button</button>`,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class TestTooltipComponent2 {}

@Component({
  selector: 'mdb-test-tooltip2',
  template: ` <button mdbTooltip="testMdbTooltip" tooltipDisabled="true" trigger="click">
    MDB Button
  </button>`,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class TestTooltipComponent3 {}
