import { ComponentFixture, fakeAsync, flush, inject, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Directive } from '@angular/core';
import { MdbDropdownModule } from './index';
import { MdbDropdownDirective } from './index';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('MDB Dropdown', () => {
  let fixture: ComponentFixture<TestDropdownComponent>;
  let element: any;
  let component: TestDropdownComponent;
  let directive: any;
  let debugElement: DebugElement;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdbDropdownModule, NoopAnimationsModule],
      declarations: [TestDropdownComponent],
      teardown: { destroyAfterEach: false },
    });

    inject([OverlayContainer], (container: OverlayContainer) => {
      overlayContainer = container;
      overlayContainerElement = container.getContainerElement();
    })();

    fixture = TestBed.createComponent(TestDropdownComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('after init', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should open and close dropdown on click', fakeAsync(() => {
      directive = fixture.debugElement
        .query(By.directive(MdbDropdownDirective))
        .injector.get(MdbDropdownDirective) as MdbDropdownDirective;

      const onOpen = jest.spyOn(directive, 'show');
      const onClose = jest.spyOn(directive, 'hide');

      const buttonEl = debugElement.query(By.css('.dropdown-toggle')).nativeElement;

      buttonEl.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      flush();
      expect(directive.show).toHaveBeenCalled();
      expect(overlayContainerElement.textContent).toContain('Action');

      buttonEl.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      flush();

      expect(directive.hide).toHaveBeenCalled();
      expect(overlayContainerElement.textContent).toContain('');
    }));

    it('should don`t modify dropdown position', () => {
      directive = fixture.debugElement
        .query(By.directive(MdbDropdownDirective))
        .injector.get(MdbDropdownDirective) as MdbDropdownDirective;

      const buttonEl = debugElement.query(By.css('.dropdown-toggle')).nativeElement;

      buttonEl.dispatchEvent(new Event('click'));

      expect(directive._isDropUp).toBe(false);
      expect(directive._isDropStart).toBe(false);
      expect(directive._isDropEnd).toBe(false);
      expect(directive._isDropdownMenuEnd).toBe(false);
      expect(directive._xPosition).toBe('start');
    });

    it('should set dropup', () => {
      component.positionClass = 'dropup';

      fixture.detectChanges();

      directive = fixture.debugElement
        .query(By.directive(MdbDropdownDirective))
        .injector.get(MdbDropdownDirective) as MdbDropdownDirective;

      const buttonEl = debugElement.query(By.css('.dropdown-toggle')).nativeElement;

      buttonEl.dispatchEvent(new Event('click'));

      expect(directive._isDropUp).toBe(true);
    });

    it('should set dropstart', () => {
      component.positionClass = 'dropstart';

      fixture.detectChanges();

      directive = fixture.debugElement
        .query(By.directive(MdbDropdownDirective))
        .injector.get(MdbDropdownDirective) as MdbDropdownDirective;

      const buttonEl = debugElement.query(By.css('.dropdown-toggle')).nativeElement;

      buttonEl.dispatchEvent(new Event('click'));

      expect(directive._isDropStart).toBe(true);
    });

    it('should set dropend', () => {
      component.positionClass = 'dropend';

      fixture.detectChanges();

      directive = fixture.debugElement
        .query(By.directive(MdbDropdownDirective))
        .injector.get(MdbDropdownDirective) as MdbDropdownDirective;

      const buttonEl = debugElement.query(By.css('.dropdown-toggle')).nativeElement;

      buttonEl.dispatchEvent(new Event('click'));

      expect(directive._isDropEnd).toBe(true);
    });

    it('should set dropdownMenuEnd', () => {
      component.menuEndClass = 'dropdown-menu-end';

      fixture.detectChanges();

      directive = fixture.debugElement
        .query(By.directive(MdbDropdownDirective))
        .injector.get(MdbDropdownDirective) as MdbDropdownDirective;

      const buttonEl = debugElement.query(By.css('.dropdown-toggle')).nativeElement;

      buttonEl.dispatchEvent(new Event('click'));

      expect(directive._isDropdownMenuEnd).toBe(true);
      expect(directive._xPosition).toBe('end');
    });
  });

  describe('Keyboard navigation', () => {
    it('should correctly focus dropdown items when ArrowUp or ArrowDown key is used', fakeAsync(() => {
      directive = fixture.debugElement
        .query(By.directive(MdbDropdownDirective))
        .injector.get(MdbDropdownDirective) as MdbDropdownDirective;

      directive.show();
      fixture.detectChanges();
      flush();

      const menu = document.querySelector('.dropdown-menu');
      const items = menu.querySelectorAll('.dropdown-item');

      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();

      expect(document.activeElement).toBe(items[0]);

      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();

      expect(document.activeElement).toBe(items[1]);

      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      expect(document.activeElement).toBe(items[0]);
    }));

    it('should focus last option if ArrowUp is used and no item is selected', fakeAsync(() => {
      directive = fixture.debugElement
        .query(By.directive(MdbDropdownDirective))
        .injector.get(MdbDropdownDirective) as MdbDropdownDirective;

      directive.show();
      fixture.detectChanges();
      flush();

      const menu = document.querySelector('.dropdown-menu');
      const items = menu.querySelectorAll('.dropdown-item');

      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      expect(document.activeElement).toBe(items[items.length - 1]);
    }));
  });
});

@Component({
  selector: 'mdb-dropdown-test',
  template: `
    <div mdbDropdown class="dropdown" [ngClass]="positionClass">
      <button class="btn btn-primary dropdown-toggle" mdbDropdownToggle>Dropdown button</button>
      <ul
        mdbDropdownMenu
        class="dropdown-menu"
        [ngClass]="menuEndClass"
        aria-labelledby="dropdownMenuButton"
      >
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class TestDropdownComponent {
  positionClass: string;
  menuEndClass: string;
}
