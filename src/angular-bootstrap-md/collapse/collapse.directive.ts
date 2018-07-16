
// todo: add animations when https://github.com/angular/angular/issues/9947 solved
import {
  Directive, ElementRef, EventEmitter, Input, OnInit, Output,
  Renderer2, AfterViewInit, Inject, PLATFORM_ID
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[mdbCollapse]',
  exportAs: 'bs-collapse',
  /* tslint:disable-next-line */
})
export class CollapseDirective implements OnInit, AfterViewInit {

  @Output('showBsCollapse') public showBsCollapse: EventEmitter<any> = new EventEmitter();
  @Output('shownBsCollapse') public shownBsCollapse: EventEmitter<any> = new EventEmitter();
  @Output('hideBsCollapse') public hideBsCollapse: EventEmitter<any> = new EventEmitter();
  @Output('hiddenBsCollapse') public hiddenBsCollapse: EventEmitter<any> = new EventEmitter();


  /** This event fires as soon as content collapses */
  @Output() public collapsed: EventEmitter<any> = new EventEmitter();
  /** This event fires as soon as content becomes visible */
  @Output() public expanded: EventEmitter<any> = new EventEmitter();
  // shown
  // @HostBinding('class.in')
  // @HostBinding('class.show')
  // @HostBinding('attr.aria-expanded')
  public isExpanded = true;
  // hidden
  // @HostBinding('attr.aria-hidden')
  public isCollapsed = false;
  // stale state
  // @HostBinding('class.collapse')
  public isCollapse = true;
  // animation state
  // @HostBinding('class.collapsing')
  public isCollapsing = false;
  public collapsing = false;


  @Input() public collapse: boolean;
  @Input() public animationTime = 500;

  public maxHeight: number;


  protected _el: ElementRef;
  protected _renderer: Renderer2;
  isBrowser: any = false;
  public constructor(_el: ElementRef,
    _renderer: Renderer2,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) platformId: string) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._el = _el;
    this._renderer = _renderer;
  }
  ngOnInit() {

    this._el.nativeElement.classList.add('show');

    this._el.nativeElement.style.transition = this.animationTime + 'ms ease';

    if (!this.collapse) {
      this._el.nativeElement.classList.remove('show');
      this.hide();
    } else {
      this.show();
    }

    this.isExpanded = this.collapse;
  }

  ngAfterViewInit() {
    this.maxHeight = this._el.nativeElement.scrollHeight;
  }

  public resize(): void {
    const container = this._el.nativeElement;
    this.maxHeight = this._el.nativeElement.scrollHeight;
    this._renderer.setStyle(container, 'height', this.maxHeight + 'px');
  }

  /** allows to manually toggle content visibility */
  public toggle(event?: any): void {
    if (!this.collapsing) {
      if (this.isExpanded) {
        this.hide();
      } else {
        this.show();
      }
    }
    try {
      if (this.isBrowser) {
        const fixedButtonContainer: any = this.document.querySelector('.fixed-action-btn');
        const fixedCollapseContainer: any = this.document.querySelector('.fixed_collapse');
        if (event.type === 'click') {
          // If fixedButtonContainer got top style instead of bottom, remove bottom styles from this._el.nativeElement - needed in cases,
          // when menu should be slided from the button instead of from the bottom edge of the screen.
          if (fixedButtonContainer.style.top !== '' && window.innerHeight - event.clientY > this.maxHeight) {
            this._renderer.setStyle(this._el.nativeElement, 'bottom', 'unset');
          }
          this.maxHeight = fixedCollapseContainer.scrollHeight;
        } else if (event.type === 'mouseenter' || event.type === 'mouseleave') {
          // Same as in 103 line.
          if (fixedButtonContainer.style.top !== '' && window.innerHeight - event.clientY > this.maxHeight) {
            this._renderer.setStyle(this._el.nativeElement, 'bottom', 'unset');
          }
          this.maxHeight = fixedCollapseContainer.scrollHeight;
        }
      }
    } catch (error) { }
  }


  /** allows to manually hide content */
  public hide(): void {
    this.collapsing = true;
    this.hideBsCollapse.emit(this);
    this.isCollapse = false;
    this.isCollapsing = true;

    this.isExpanded = false;
    this.isCollapsed = true;

    const container = this._el.nativeElement;

    container.classList.remove('collapse');
    container.classList.remove('show');
    container.classList.add('collapsing');

    this._renderer.setStyle(container, 'height', '0px');

    setTimeout(() => {
      container.classList.remove('collapsing');
      container.classList.add('collapse');
      this.hiddenBsCollapse.emit(this);
      this.collapsing = false;
    }, this.animationTime);
    this.collapsed.emit(this);
  }

  /** allows to manually show collapsed content */
  public show(): void {
    if (!this.isExpanded) {
      this.collapsing = true;
      this.showBsCollapse.emit(this);
      this.isCollapse = false;
      this.isCollapsing = true;

      this.isExpanded = true;
      this.isCollapsed = false;

      const container = this._el.nativeElement;

      container.classList.remove('collapse');
      container.classList.add('collapsing');

      setTimeout(() => {
        this._renderer.setStyle(container, 'height', this.maxHeight + 'px');
      }, 10);

      setTimeout(() => {
        container.classList.remove('collapsing');
        container.classList.add('collapse');
        container.classList.add('show');
        this.shownBsCollapse.emit(this);
        this.collapsing = false;
      }, this.animationTime - (this.animationTime * 0.5));
      this.expanded.emit(this);
    }
  }
}
