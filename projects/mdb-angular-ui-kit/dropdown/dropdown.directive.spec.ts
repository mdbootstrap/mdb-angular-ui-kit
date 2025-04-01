import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MdbDropdownMenuDirective, MdbDropdownModule } from './index';
import { MdbDropdownDirective } from './index';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { first } from 'rxjs';

describe('MDB Dropdown', () => {
  let fixture: ComponentFixture<TestDropdownComponent>;
  let testComponent: TestDropdownComponent;
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
    testComponent = fixture.componentInstance;
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

      const buttonEl: HTMLButtonElement = fixture.nativeElement.querySelector('.dropdown-toggle');

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
  });

  describe('Accessibility', () => {
    it('should update aria-expanded attribute on dropdown open and close', fakeAsync(() => {
      const buttonEl: HTMLButtonElement = fixture.nativeElement.querySelector('.dropdown-toggle');

      buttonEl.click();
      fixture.detectChanges();

      expect(buttonEl.getAttribute('aria-expanded')).toBe('true');

      buttonEl.click();
      fixture.detectChanges();
      flush();

      expect(buttonEl.getAttribute('aria-expanded')).toContain('false');
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
  });

  describe('Inputs', () => {
    it('should not close dropdown on ESC keyup if closeOnEsc input is set to false', fakeAsync(() => {
      testComponent.closeOnEsc = false;
      directive.show();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Action');

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Action');
    }));

    it('should not close dropdown on dropdown item click if closeOnItemClick input is set to false', fakeAsync(() => {
      testComponent.closeOnItemClick = false;
      directive.show();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Action');

      const item: HTMLElement = document.querySelector('.dropdown-item');

      item.click();
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Action');
    }));

    it('should not close dropdown on outside click if closeOnOutsideClick input is set to false', fakeAsync(() => {
      testComponent.closeOnOutsideClick = false;
      directive.show();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Action');

      document.body.click();
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Action');
    }));

    it('should apply appropriate transform style when offset input is set', () => {
      testComponent.offset = 43;
      fixture.detectChanges();

      directive.show();
      fixture.detectChanges();

      let overlayPane: HTMLDivElement = overlayContainerElement.querySelector('.cdk-overlay-pane');
      expect(overlayPane.style.transform).toBe('translateY(43px)');
    });

    it('should apply appropriate class when positionClass input is set', () => {
      expect(directive.host.classList).toContain('dropdown');
      expect(directive.host.classList).not.toContain('dropup');

      directive.positionClass = 'dropup';

      expect(directive.host.classList).not.toContain('dropdown');
      expect(directive.host.classList).toContain('dropup');
    });

    it('should apply appropriate class when menuPositionClass input is set', () => {
      const dropdownMenuDirective: MdbDropdownMenuDirective = directive._dropdownMenu;
      expect(dropdownMenuDirective.elementRef.nativeElement.classList).toContain(
        'dropdown-menu-start'
      );
      expect(dropdownMenuDirective.elementRef.nativeElement.classList).not.toContain(
        'dropdown-menu-end'
      );

      dropdownMenuDirective.menuPositionClass = 'dropdown-menu-end';

      expect(dropdownMenuDirective.elementRef.nativeElement.classList).not.toContain(
        'dropdown-menu-start'
      );
      expect(dropdownMenuDirective.elementRef.nativeElement.classList).toContain(
        'dropdown-menu-end'
      );
    });
  });

  describe('Outputs', () => {
    it('should emit events on show and hide', fakeAsync(() => {
      let showDropdown: MdbDropdownDirective | undefined;
      let shownDropdown: MdbDropdownDirective | undefined;
      let hideDropdown: MdbDropdownDirective | undefined;
      let hiddenDropdown: MdbDropdownDirective | undefined;

      const showSpy = jest.spyOn(directive.dropdownShow, 'emit');
      const shownSpy = jest.spyOn(directive.dropdownShown, 'emit');
      const hideSpy = jest.spyOn(directive.dropdownHide, 'emit');
      const hiddenSpy = jest.spyOn(directive.dropdownHidden, 'emit');

      directive.dropdownShow.pipe(first()).subscribe((event) => (showDropdown = event));
      directive.dropdownShown.pipe(first()).subscribe((event) => (shownDropdown = event));
      directive.dropdownHide.pipe(first()).subscribe((event) => (hideDropdown = event));
      directive.dropdownHidden.pipe(first()).subscribe((event) => (hiddenDropdown = event));

      directive.show();
      fixture.detectChanges();

      expect(showSpy).toHaveBeenCalledTimes(1);
      expect(showDropdown).toEqual(directive);

      tick();

      expect(shownSpy).toHaveBeenCalledTimes(1);
      expect(shownDropdown).toEqual(directive);

      directive.hide();
      fixture.detectChanges();

      expect(hideSpy).toHaveBeenCalledTimes(1);
      expect(hideDropdown).toEqual(directive);

      tick();

      expect(hiddenSpy).toHaveBeenCalledTimes(1);
      expect(hiddenDropdown).toEqual(directive);
    }));
  });

  describe('Public methods', () => {
    it('should show dropdown when show method is called', fakeAsync(() => {
      expect(overlayContainerElement.textContent).not.toContain('Action');

      directive.show();
      fixture.detectChanges();
      flush();

      expect(overlayContainerElement.textContent).toContain('Action');
    }));

    it('should hide dropdown when hide method is called', fakeAsync(() => {
      expect(overlayContainerElement.textContent).not.toContain('Action');

      directive.show();
      fixture.detectChanges();
      flush();

      expect(overlayContainerElement.textContent).toContain('Action');

      directive.hide();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should toggle dropdown when toggle method is called', fakeAsync(() => {
      expect(overlayContainerElement.textContent).not.toContain('Action');

      directive.toggle();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Action');

      directive.toggle();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toEqual('');
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
      [offset]="offset"
    >
      <button class="btn btn-primary dropdown-toggle" mdbDropdownToggle>Dropdown button</button>
      <ul
        mdbDropdownMenu
        class="dropdown-menu dropdown-menu-start"
        aria-labelledby="dropdownMenuButton"
      >
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
  `,
  standalone: false,
})
class TestDropdownComponent {
  closeOnOutsideClick = true;
  closeOnItemClick = true;
  closeOnEsc = true;
  offset = 0;
}
