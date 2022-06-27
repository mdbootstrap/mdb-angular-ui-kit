import { ComponentFixture, fakeAsync, flush, inject, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { MdbDropdownModule } from './index';
import { MdbDropdownDirective } from './index';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('MDB Dropdown', () => {
  let fixture: ComponentFixture<TestDropdownComponent>;
  let element: any;
  let component: TestDropdownComponent;
  let directive: MdbDropdownDirective;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
    directive = fixture.debugElement
      .query(By.directive(MdbDropdownDirective))
      .injector.get<MdbDropdownDirective>(MdbDropdownDirective);

    fixture.detectChanges();
  });

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('Opening and closing', () => {
    it('should open and close dropdown on click', fakeAsync(() => {
      jest.spyOn(directive, 'show');
      jest.spyOn(directive, 'hide');

      const buttonEl: HTMLButtonElement = element.querySelector('.dropdown-toggle');

      buttonEl.click();
      fixture.detectChanges();

      expect(directive.show).toHaveBeenCalled();
      expect(overlayContainerElement.textContent).toContain('Action');

      buttonEl.click();
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      expect(directive.hide).toHaveBeenCalled();
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close dropdown on outside click', fakeAsync(() => {
      directive.show();
      fixture.detectChanges();

      document.body.click();
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should not close dropdown on outside click if closeOnOutsideClick is set to false', fakeAsync(() => {
      component.closeOnOutsideClick = false;
      directive.show();
      fixture.detectChanges();

      document.body.click();
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Action');
    }));

    it('should close dropdown on dropdown item click', fakeAsync(() => {
      directive.show();
      fixture.detectChanges();

      const item: HTMLElement = document.querySelector('.dropdown-item');

      item.click();
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should not close dropdown on dropdown item click if closeOnItemClick is set to false', fakeAsync(() => {
      component.closeOnItemClick = false;
      directive.show();
      fixture.detectChanges();

      const item: HTMLElement = document.querySelector('.dropdown-item');

      item.click();
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Action');
    }));
  });

  describe('Keyboard navigation', () => {
    it('should correctly focus dropdown items when ArrowUp or ArrowDown key is used', () => {
      directive.show();
      fixture.detectChanges();

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
    });

    it('should focus last option if ArrowUp is used and no item is selected', () => {
      directive.show();
      fixture.detectChanges();

      const menu = document.querySelector('.dropdown-menu');
      const items = menu.querySelectorAll('.dropdown-item');

      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      expect(document.activeElement).toBe(items[items.length - 1]);
    });

    it('should close dropdown on ESC keyup', fakeAsync(() => {
      directive.show();
      fixture.detectChanges();

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should not close dropdown on ESC keyup if closeOnEsc is set to false', fakeAsync(() => {
      component.closeOnEsc = false;
      directive.show();
      fixture.detectChanges();

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Action');
    }));
  });
});

@Component({
  selector: 'mdb-dropdown-test',
  template: `
    <div
      mdbDropdown
      class="dropdown"
      [closeOnOutsideClick]="closeOnOutsideClick"
      [closeOnItemClick]="closeOnItemClick"
      [closeOnEsc]="closeOnEsc"
    >
      <button class="btn btn-primary dropdown-toggle" mdbDropdownToggle>Dropdown button</button>
      <ul mdbDropdownMenu class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class TestDropdownComponent {
  closeOnOutsideClick = true;
  closeOnItemClick = true;
  closeOnEsc = true;
}
