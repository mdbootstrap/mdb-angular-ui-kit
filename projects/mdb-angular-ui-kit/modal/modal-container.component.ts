import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  HostBinding,
  HostListener,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MdbModalConfig } from './modal-config';
import { ConfigurableFocusTrapFactory, ConfigurableFocusTrap } from '@angular/cdk/a11y';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

// width below which, according to css rules, modal position changes - modal gets position relative instead of absolute.
const MODAL_CSS_BREAKPOINT = 992;
const MODAL_OPEN_CLASS = 'modal-open';
const NON_INVASIVE_CLASS = 'modal-non-invasive-open';
const NON_INVASIVE_SHOW_CLASS = 'modal-non-invasive-show';

@Component({
  selector: 'mdb-modal-container',
  templateUrl: 'modal-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MdbModalContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;
  @ViewChild('dialog', { static: true }) modalDialog: ElementRef;
  @ViewChild('content', { static: true }) modalContent: ElementRef;

  readonly _destroy$: Subject<void> = new Subject<void>();
  readonly backdropClick$: Subject<MouseEvent> = new Subject<MouseEvent>();

  _config: MdbModalConfig;

  BACKDROP_TRANSITION = 150;
  MODAL_TRANSITION = 200;
  NON_INVASIVE_TRANSITION = 450;

  private _previouslyFocusedElement: HTMLElement;
  private _focusTrap: ConfigurableFocusTrap;

  @HostBinding('class.modal') modal = true;
  @HostBinding('class.fade')
  get hasAnimation(): boolean {
    return this._config.animation;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this._ngZone.runOutsideAngular(() => {
      if (this._config.nonInvasive) {
        this._handleWindowResize();
      }
    });
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  private _isScrollable = false;
  private _isBottomRight = false;
  private _isBottomLeft = false;
  private _isTopRight = false;
  private _isTopLeft = false;
  private _isSideTopModal = false;
  private _isSideBottomModal = false;
  private _isSideModal = false;
  private _isModalBottom = false;
  private _modalContentRect: null | DOMRectReadOnly;
  private _modalContentComputedStyles: null | CSSStyleDeclaration;
  private _modalDialogComputedStyles: null | CSSStyleDeclaration;
  private _topOffset = 0;
  private _leftOffset = 0;
  private _rightOffset = 0;
  private _bottomOffset = 0;

  constructor(
    @Inject(DOCUMENT) private _document,
    public _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _focusTrapFactory: ConfigurableFocusTrapFactory,
    private _ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this._updateContainerClass();
    this._renderer.setStyle(this.host, 'display', 'block');

    if (!this._config.nonInvasive) {
      this._focusTrap = this._focusTrapFactory.create(this.host);
      this._previouslyFocusedElement = this._document.activeElement as HTMLElement;
    }

    if (this._config.animation) {
      setTimeout(() => {
        this._renderer.addClass(this.host, 'show');

        setTimeout(() => {
          this._focusTrap?.focusInitialElementWhenReady();
        }, this.MODAL_TRANSITION);
      }, this.BACKDROP_TRANSITION);
    } else {
      this._focusTrap?.focusInitialElementWhenReady();
    }
  }

  ngAfterViewInit(): void {
    const widthWithVerticalScroll = this._document.body.offsetWidth;
    this._renderer.addClass(this._document.body, MODAL_OPEN_CLASS);

    if (this._config.nonInvasive) {
      this._renderer.addClass(this._document.body, NON_INVASIVE_CLASS);
      setTimeout(() => {
        this._onNonInvasiveModalShown();
      }, this.NON_INVASIVE_TRANSITION);
    }

    if (!this._config.nonInvasive) {
      this._renderer.setStyle(this._document.body, 'overflow', 'hidden');
    }

    const widthWithoutVerticalScroll = this._document.body.offsetWidth;

    if (!this._config.nonInvasive) {
      this._renderer.setStyle(
        this._document.body,
        'padding-right',
        `${widthWithoutVerticalScroll - widthWithVerticalScroll}px`
      );
    }

    if (!this._config.ignoreBackdropClick && !this._config.nonInvasive) {
      fromEvent(this.host, 'mousedown')
        .pipe(
          filter((event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const dialog = this.modalDialog.nativeElement;
            const notDialog = target !== dialog;
            const notDialogContent = !dialog.contains(target);
            return notDialog && notDialogContent;
          }),
          takeUntil(this._destroy$)
        )
        .subscribe((event: MouseEvent) => {
          this.backdropClick$.next(event);
        });
    }
  }

  ngOnDestroy(): void {
    this._previouslyFocusedElement?.focus();
    this._focusTrap?.destroy();

    this._destroy$.next();
    this._destroy$.complete();
  }

  private _updateContainerClass(): void {
    if (
      this._config.containerClass === '' ||
      (this._config.containerClass.length && this._config.containerClass.length === 0)
    ) {
      return;
    }

    const containerClasses = this._config.containerClass.split(' ');

    containerClasses.forEach((containerClass) => {
      this._renderer.addClass(this.host, containerClass);
    });
  }

  private _onNonInvasiveModalShown() {
    this._isScrollable = this._config.modalClass.includes('modal-dialog-scrollable');
    this._isBottomRight = this._config.modalClass.includes('modal-bottom-right');
    this._isBottomLeft = this._config.modalClass.includes('modal-bottom-left');
    this._isTopRight = this._config.modalClass.includes('modal-top-right');
    this._isTopLeft = this._config.modalClass.includes('modal-top-left');
    this._isModalBottom = this._config.modalClass.includes('modal-bottom');
    this._isSideTopModal = this._isTopLeft || this._isTopRight;
    this._isSideBottomModal = this._isBottomLeft || this._isBottomRight;
    this._isSideModal = this._isSideTopModal || this._isSideBottomModal;
    this._modalContentRect = this.modalContent.nativeElement.getBoundingClientRect();
    this._modalContentComputedStyles = window.getComputedStyle(this.modalContent.nativeElement);
    this._modalDialogComputedStyles = window.getComputedStyle(this.modalDialog.nativeElement);
    this._topOffset = parseInt(this._modalDialogComputedStyles.top, 0);
    this._leftOffset = parseInt(this._modalDialogComputedStyles.left, 0);
    this._rightOffset = parseInt(this._modalDialogComputedStyles.right, 0);
    this._bottomOffset = parseInt(this._modalDialogComputedStyles.bottom, 0);

    this._renderer.addClass(this.host, NON_INVASIVE_SHOW_CLASS);
    this._setNonInvasiveStyles();
  }

  private _setNonInvasiveStyles(leftOffset = 0, topOffset = 0) {
    const isAboveBreakpoint = window.innerWidth >= MODAL_CSS_BREAKPOINT;
    this._renderer.setStyle(this.host, 'left', `${this._modalContentRect.left + leftOffset}px`);
    this._renderer.setStyle(this.host, 'width', this._modalContentComputedStyles.width);

    if (!this._isScrollable) {
      // If the modal content is not long enough to require scroll shrink the modal wrapper to
      // the height of modal content so other elements on site are clickable outside modal
      this._renderer.setStyle(this.host, 'height', this._modalContentComputedStyles.height);
      this._renderer.setStyle(this.host, 'display', '');
    }

    if (isAboveBreakpoint) {
      if (this._isSideBottomModal || this._isModalBottom) {
        // Force modal to correct bottom placement. It's needed because modal host has position
        // fixed and fixed height.
        this._renderer.setStyle(this.host, 'top', `${this._modalContentRect.top + topOffset}px`);
      }

      if (this._isSideModal) {
        // Enable horizontal scrolling when the content is wider than the modal's fixed width
        this._renderer.setStyle(this.host, 'overflowX', 'auto');
      }
    }

    if (!isAboveBreakpoint) {
      this.host.style.height = '';
    }
  }

  _onNonInvasiveModalHidden() {
    this._renderer.removeClass(this.host, NON_INVASIVE_SHOW_CLASS);
    this._resetNonInvasiveStyles();
    this._removeNonInvasiveClass();
  }

  private _resetNonInvasiveStyles() {
    this._renderer.setStyle(this.host, 'left', '');
    this._renderer.setStyle(this.host, 'top', '');
    this._renderer.setStyle(this.host, 'height', '');
    this._renderer.setStyle(this.host, 'width', '');

    if (!this._isScrollable) {
      this._renderer.setStyle(this.host, 'display', '');
    }

    if (this._isSideModal) {
      this._renderer.setStyle(this.host, 'overflowX', '');
    }
  }

  private _removeNonInvasiveClass() {
    const isOtherModalOpen = this._document.body.querySelector(
      '.modal.show.modal-non-invasive-show'
    );
    if (!isOtherModalOpen) {
      this._renderer.removeClass(this._document.body, NON_INVASIVE_CLASS);
    } else {
      this._renderer.addClass(this._document.body, MODAL_OPEN_CLASS);
    }
  }

  private _handleWindowResize() {
    const modalContent = this.host.querySelector('.modal-content');
    this._resetNonInvasiveStyles();

    this._modalContentRect = modalContent.getBoundingClientRect();
    this._modalContentComputedStyles = window.getComputedStyle(modalContent);

    if (this._isSideTopModal || this._isSideBottomModal) {
      let sideOffset = 0;
      let topOffset = 0;
      if (this._isBottomRight || this._isBottomLeft) {
        topOffset = -this._bottomOffset;
      }
      if (this._isBottomRight || this._isTopRight) {
        sideOffset = -this._rightOffset;
      }
      if (this._isBottomLeft || this._isTopLeft) {
        sideOffset = this._leftOffset;
      }

      this._setNonInvasiveStyles(sideOffset, topOffset);
    } else {
      this._setNonInvasiveStyles();
    }
  }

  _close(): void {
    if (this._config.animation) {
      this._renderer.removeClass(this.host, 'show');
    }

    // Pause iframe/video when closing modal
    const iframeElements = Array.from(this.host.querySelectorAll('iframe'));
    const videoElements = Array.from(this.host.querySelectorAll('video'));

    iframeElements.forEach((iframe: HTMLIFrameElement) => {
      const srcAttribute: any = iframe.getAttribute('src');
      this._renderer.setAttribute(iframe, 'src', srcAttribute);
    });

    videoElements.forEach((video: HTMLVideoElement) => {
      video.pause();
    });
  }

  _restoreScrollbar(): void {
    this._renderer.removeClass(this._document.body, MODAL_OPEN_CLASS);
    this._renderer.removeStyle(this._document.body, 'overflow');
    this._renderer.removeStyle(this._document.body, 'padding-right');
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return this._portalOutlet.attachTemplatePortal(portal);
  }
}
