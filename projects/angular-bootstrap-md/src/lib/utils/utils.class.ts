import { window, document } from './facade/browser';
import {ElementRef} from '@angular/core';

export class Utils {
  constructor() {

  }
  public static reflow(element: any): void {
    ((bs: any): void => bs)(element.offsetHeight);
  }

  // source: https://github.com/jquery/jquery/blob/master/src/css/var/getStyles.js
  public static getStyles(elem: any): any {
    // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
    // IE throws on elements created in popups
    // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    let view = elem.ownerDocument.defaultView;

    if (!view || !view.opener) {
      view = window;
    }

    return view.getComputedStyle(elem);
  }

  public focusTrapModal(event: KeyboardEvent | any, el: ElementRef) {
    let focusableElements: any;
    let firstFocusableElement: any;
    let lastFocusableElement: any;

    const KEYCODE_TAB = 9;
    /*tslint:disable-next-line:max-line-length */
    focusableElements = el.nativeElement.querySelectorAll('a[href], button, textarea, input, select, form, mdb-select, mdb-auto-completer, mdb-checkbox, mdb-range-input');
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab' || event.keyCode === KEYCODE_TAB) {
      if (event.shiftKey) {
        if (document && document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          event.preventDefault();
        }
      } else {
        if (document && document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          event.preventDefault();
        }
      }
    }
  }

  public getClosestEl(el: any, selector: string) {
    for (; el && el !== document; el = el.parentNode) {
      if (el.matches && el.matches(selector)) {
        return el;
      }
    }
    return null;
  }

  public getCoords(elem: any): any {
      const box: ClientRect = elem.getBoundingClientRect();
      const body: any = document.body;
      const docEl: any = document.documentElement;

      const scrollTop: number = window.pageYOffset || docEl.scrollTop || body.scrollTop;
      const scrollLeft: number = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

      const clientTop: number = docEl.clientTop || body.clientTop || 0;
      const clientLeft: number = docEl.clientLeft || body.clientLeft || 0;

      const top: number = box.top + scrollTop - clientTop;
      const left: number = box.left + scrollLeft - clientLeft;

      return {top: Math.round(top), left: Math.round(left)};
  }
}
