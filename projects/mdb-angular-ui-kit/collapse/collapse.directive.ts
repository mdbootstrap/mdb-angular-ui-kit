import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';

const TRANSITION_TIME = 350;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbCollapse]',
  exportAs: 'mdbCollapse',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbCollapseDirective {
  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {}

  @HostBinding('class.collapse') collapseClass = true;

  @Output() collapseShow: EventEmitter<MdbCollapseDirective> = new EventEmitter();
  @Output() collapseShown: EventEmitter<MdbCollapseDirective> = new EventEmitter();
  @Output() collapseHide: EventEmitter<MdbCollapseDirective> = new EventEmitter();
  @Output() collapseHidden: EventEmitter<MdbCollapseDirective> = new EventEmitter();

  @Input()
  set collapsed(collapsed: boolean) {
    if (collapsed !== this._collapsed) {
      collapsed ? this.hide() : this.show();
      this._collapsed = collapsed;
    }
  }
  get collapsed(): boolean {
    return this._collapsed;
  }
  private _collapsed = true;

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  private _isTransitioning = false;

  show(): void {
    if (this._isTransitioning || !this.collapsed) {
      return;
    }

    this.collapseShow.emit(this);

    this._renderer.removeClass(this.host, 'collapse');
    this._renderer.addClass(this.host, 'collapsing');

    this._renderer.setStyle(this.host, 'height', '0px');

    this._isTransitioning = true;

    const scrollHeight = this.host.scrollHeight;

    fromEvent(this.host, 'transitionend')
      .pipe(take(1))
      .subscribe(() => {
        this._isTransitioning = false;
        this.collapsed = false;
        this._renderer.removeClass(this.host, 'collapsing');
        this._renderer.addClass(this.host, 'collapse');
        this._renderer.addClass(this.host, 'show');

        this._renderer.removeStyle(this.host, 'height');

        this.collapseShown.emit(this);
      });

    this._emulateTransitionEnd(this.host, TRANSITION_TIME);

    this._renderer.setStyle(this.host, 'height', `${scrollHeight}px`);
  }

  hide(): void {
    if (this._isTransitioning || this.collapsed) {
      return;
    }

    this.collapseHide.emit(this);

    const hostHeight = this.host.getBoundingClientRect().height;

    this._renderer.setStyle(this.host, 'height', `${hostHeight}px`);

    this._reflow(this.host);

    this._renderer.addClass(this.host, 'collapsing');
    this._renderer.removeClass(this.host, 'collapse');
    this._renderer.removeClass(this.host, 'show');

    this._isTransitioning = true;

    fromEvent(this.host, 'transitionend')
      .pipe(take(1))
      .subscribe(() => {
        this._renderer.removeClass(this.host, 'collapsing');
        this._renderer.addClass(this.host, 'collapse');
        this._isTransitioning = false;
        this.collapsed = true;

        this.collapseHidden.emit(this);
      });

    this._renderer.removeStyle(this.host, 'height');
    this._emulateTransitionEnd(this.host, TRANSITION_TIME);
  }

  toggle(): void {
    if (this._isTransitioning) {
      return;
    }

    this.collapsed = !this.collapsed;
    this.collapsed ? this.hide() : this.show();
  }

  private _reflow(element: HTMLElement): number {
    return element.offsetHeight;
  }

  private _emulateTransitionEnd(element: HTMLElement, duration: number): void {
    let eventEmitted = false;
    const durationPadding = 5;
    const emulatedDuration = duration + durationPadding;

    fromEvent(element, 'transitionend')
      .pipe(take(1))
      .subscribe(() => {
        eventEmitted = true;
      });

    setTimeout(() => {
      if (!eventEmitted) {
        element.dispatchEvent(new Event('transitionend'));
      }
    }, emulatedDuration);
  }
}
