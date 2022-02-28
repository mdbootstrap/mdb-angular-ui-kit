import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MdbPopoverModule } from './index';
import { MdbPopoverDirective } from './popover.directive';
import { MdbPopoverComponent } from './popover.component';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MDB Popover', () => {
  describe('after init', () => {
    let fixture: ComponentFixture<TestPopoverComponent>;
    let element: any;
    let component: any;
    let directive: any;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MdbPopoverModule, NoopAnimationsModule],
        declarations: [TestPopoverComponent],
        teardown: { destroyAfterEach: false },
      }).overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [MdbPopoverComponent],
        },
      });
      fixture = TestBed.createComponent(TestPopoverComponent);
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
        .query(By.directive(MdbPopoverDirective))
        .injector.get(MdbPopoverDirective) as MdbPopoverDirective;

      const onOpen = jest.spyOn(directive, 'show');
      const onClose = jest.spyOn(directive, 'hide');

      const buttonEl = element.querySelector('button');

      buttonEl.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();

      expect(directive.show).toHaveBeenCalled();

      directive._open = true;
      buttonEl.dispatchEvent(new Event('mouseleave'));
      fixture.detectChanges();

      expect(directive.hide).toHaveBeenCalled();
    });

    it('should set popover header and title', () => {
      jest.useFakeTimers();
      const buttonEl = fixture.nativeElement.querySelector('button');

      buttonEl.dispatchEvent(new Event('mouseenter'));
      jest.runAllTimers();

      fixture.detectChanges();
      const popoverContent = document.querySelector('.popover-body').textContent;
      const popoverTitle = document.querySelector('.popover-header').textContent;

      expect(popoverContent).toMatch(component.testMdbPopover);
      expect(popoverTitle).toMatch(component.testMdbPopoverTitle);
    });

    it('should set placement', () => {
      jest.useFakeTimers();
      const buttonEl = fixture.nativeElement.querySelector('button');

      buttonEl.dispatchEvent(new Event('mouseenter'));
      jest.runAllTimers();

      fixture.detectChanges();
      directive = fixture.debugElement
        .query(By.directive(MdbPopoverDirective))
        .injector.get(MdbPopoverDirective) as MdbPopoverDirective;

      const placement = directive._overlayRef._config.positionStrategy._lastPosition.originY;
      expect(placement).toMatch('top');
    });
  });

  describe('onInit', () => {
    it('should open/close tooltip after click', () => {
      let fixture: ComponentFixture<TestPopoverComponent2>;
      let directive: any;
      let component: any;
      let element: any;

      TestBed.configureTestingModule({
        imports: [MdbPopoverModule, NoopAnimationsModule],
        declarations: [TestPopoverComponent2],
        teardown: { destroyAfterEach: false },
      }).overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [MdbPopoverComponent],
        },
      });
      fixture = TestBed.createComponent(TestPopoverComponent2);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();

      directive = fixture.debugElement
        .query(By.directive(MdbPopoverDirective))
        .injector.get(MdbPopoverDirective) as MdbPopoverDirective;

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

    it('should prevent open', () => {
      let fixture: ComponentFixture<TestPopoverComponent3>;
      let directive: any;
      let component: any;
      let element: any;

      TestBed.configureTestingModule({
        imports: [MdbPopoverModule, NoopAnimationsModule],
        declarations: [TestPopoverComponent3],
        teardown: { destroyAfterEach: false },
      }).overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [MdbPopoverComponent],
        },
      });
      fixture = TestBed.createComponent(TestPopoverComponent3);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();

      directive = fixture.debugElement
        .query(By.directive(MdbPopoverDirective))
        .injector.get(MdbPopoverDirective) as MdbPopoverDirective;

      const onOpen = jest.spyOn(directive, 'show');

      const buttonEl = fixture.nativeElement.querySelector('button');

      buttonEl.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(directive.show).not.toHaveBeenCalled();
    });
  });
});

@Component({
  selector: 'mdb-test-tooltip',
  template: ` <button
    [trigger]="testTrigger"
    [mdbPopover]="testMdbPopover"
    [mdbPopoverTitle]="testMdbPopoverTitle"
    [placement]="testPlacement"
    [disabled]="testDisabled"
  >
    MDB Button
  </button>`,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class TestPopoverComponent {
  testTrigger = 'hover';
  testMdbPopover = 'popoverTitle';
  testMdbPopoverTitle = 'popoverTitle';
  testPlacement = 'top';
  testDisabled = false;
}

@Component({
  selector: 'mdb-test-popover2',
  template: ` <button mdbPopover="testMdbPopover" trigger="click">MDB Button</button>`,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class TestPopoverComponent2 {}

@Component({
  selector: 'mdb-test-popover2',
  template: ` <button mdbPopover="testMdbPopover" popoverDisabled="true" trigger="click">
    MDB Button
  </button>`,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class TestPopoverComponent3 {}
