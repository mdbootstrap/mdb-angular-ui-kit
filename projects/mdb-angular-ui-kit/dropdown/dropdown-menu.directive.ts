import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

export type MdbDropdownMenuPositionClass = 'dropdown-menu-end';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbDropdownMenu]',
  exportAs: 'mdbDropdownMenu',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbDropdownMenuDirective {
  constructor(public elementRef: ElementRef, private _renderer: Renderer2) {}
  @Output() menuPositionClassChanged: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  get menuPositionClass(): string {
    return this._menuPositionClass;
  }

  set menuPositionClass(newClass: string) {
    const host = this.elementRef.nativeElement;
    const isSameClass = host.classList.contains(newClass);
    if (this._menuPositionClass !== newClass && !isSameClass) {
      const menuPositionClasses = [
        'dropdown-menu-start',
        'dropdown-menu-sm-start',
        'dropdown-menu-md-start',
        'dropdown-menu-lg-start',
        'dropdown-menu-xl-start',
        'dropdown-menu-xxl-start',
        'dropdown-menu-xxl-start',
        'dropdown-menu-xxl-start',
        'dropdown-menu-end',
        'dropdown-menu-sm-end',
        'dropdown-menu-md-end',
        'dropdown-menu-lg-end',
        'dropdown-menu-xl-end',
        'dropdown-menu-xxl-end',
        'dropdown-menu-xxl-end',
        'dropdown-menu-xxl-end',
      ];

      menuPositionClasses.forEach((className) => {
        this._renderer.removeClass(host, className);
      });
      this._renderer.addClass(host, newClass);

      this.menuPositionClassChanged.emit(this.menuPositionClass);
    }
  }
  private _menuPositionClass: string;
}
