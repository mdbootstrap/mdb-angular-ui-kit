import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnChanges,
  Output,
  Renderer2,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import { document, navigator, window } from '../utils/facade/browser';

import { isBs3 } from '../utils/ng2-bootstrap-config';
import { Utils } from '../utils/utils.class';
import { ModalBackdropComponent } from './modalBackdrop.component';
import { ClassName, DISMISS_REASONS, modalConfigDefaults, ModalOptions } from './modal.options';
import { ComponentLoader } from '../utils/component-loader/component-loader.class';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';

const TRANSITION_DURATION = 300;
const BACKDROP_TRANSITION_DURATION = 150;

/** Mark any code with directive to show it's content in modal */
@Component({
  // tslint:disable-next-line:component-selector
  selector: '[mdbModal]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./modals-module.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'mdb-modal, mdbModal',
})
// tslint:disable-next-line:component-class-suffix
export class ModalDirective implements AfterViewInit, OnDestroy, OnChanges {
  /** allows to set modal configuration via element property */
  @Input()
  public set config(conf: ModalOptions | any) {
    this._config = this.getConfig(conf);
  }

  public get config(): ModalOptions | any {
    return this._config;
  }

  /** This event fires immediately when the `show` instance method is called. */
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onShow: EventEmitter<ModalDirective> = new EventEmitter<ModalDirective>();
  @Output() public open: EventEmitter<ModalDirective> = new EventEmitter<ModalDirective>();
  /** This event is fired when the modal has been made visible to the user (will wait for CSS transitions to complete) */
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onShown: EventEmitter<ModalDirective> = new EventEmitter<ModalDirective>();
  @Output() public opened: EventEmitter<ModalDirective> = new EventEmitter<ModalDirective>();
  /** This event is fired immediately when the hide instance method has been called. */
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onHide: EventEmitter<ModalDirective> = new EventEmitter<ModalDirective>();
  @Output() public close: EventEmitter<ModalDirective> = new EventEmitter<ModalDirective>();
  /** This event is fired when the modal has finished being hidden from the user (will wait for CSS transitions to complete). */
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onHidden: EventEmitter<ModalDirective> = new EventEmitter<ModalDirective>();
  @Output() public closed: EventEmitter<ModalDirective> = new EventEmitter<ModalDirective>();

  // seems like an Options
  public isAnimated = true;
  /** This field contains last dismiss reason.
   Possible values: `backdrop-click`, `esc` and `null` (if modal was closed by direct call of `.hide()`). */
  public dismissReason: string | any;

  public get isShown(): boolean {
    return this._isShown;
  }

  protected _config: ModalOptions | any;
  protected _isShown = false;

  protected isBodyOverflowing = false;
  protected originalBodyPadding = 0;
  protected scrollbarWidth = 0;

  protected timerHideModal: any = 0;
  protected timerRmBackDrop: any = 0;

  // reference to backdrop component
  protected backdrop: ComponentRef<ModalBackdropComponent> | undefined;
  private _backdrop: ComponentLoader<ModalBackdropComponent>;
  // todo: implement _dialog
  _dialog: any;

  isNested = false;

  utils: Utils = new Utils();

  @HostListener('keydown', ['$event']) onKeyDown(event: any) {
    this.utils.focusTrapModal(event, this._element);
  }

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    if (
      this.config.ignoreBackdropClick ||
      this.config.backdrop === 'static' ||
      event.target !== this._element.nativeElement
    ) {
      return;
    }
    this.dismissReason = DISMISS_REASONS.BACKRDOP;
    this.hide(event);
  }

  // todo: consider preventing default and stopping propagation
  @HostListener('keydown.esc')
  public onEsc(): void {
    if (this.config.keyboard) {
      this.dismissReason = DISMISS_REASONS.ESC;
      this.hide();
    }
  }

  public constructor(
    protected _element: ElementRef,
    _viewContainerRef: ViewContainerRef,
    protected _renderer: Renderer2,
    clf: ComponentLoaderFactory
  ) {
    this._backdrop = clf.createLoader<ModalBackdropComponent>(
      _element,
      _viewContainerRef,
      _renderer
    );
  }

  public ngOnDestroy(): any {
    this.config = void 0;
    if (this._isShown) {
      this._isShown = false;
      this.hideModal();
      this._backdrop.dispose();
    }
  }

  public ngAfterViewInit(): any {
    this._config = this._config || this.getConfig();
    setTimeout(() => {
      if (this._config.show) {
        this.show();
      }
    }, 0);
  }

  public ngOnChanges(): any {
    this.config.backdrop ? this.showBackdrop() : this.removeBackdrop();
  }

  /* Public methods */

  /** Allows to manually toggle modal visibility */
  public toggle(): void {
    return this._isShown ? this.hide() : this.show();
  }

  /** Allows to manually open modal */
  public show(): void {
    this.dismissReason = null;
    this.onShow.emit(this);
    this.open.emit(this);
    if (this._isShown) {
      return;
    }
    clearTimeout(this.timerHideModal);
    clearTimeout(this.timerRmBackDrop);

    this._isShown = true;

    this.checkScrollbar();
    this.setScrollbar();

    if (document && document.body) {
      if (document.body.classList.contains(ClassName.OPEN)) {
        this.isNested = true;
      } else {
        this._renderer.addClass(document.body, ClassName.OPEN);
      }
    }
    this.showBackdrop(() => {
      this.showElement();
    });
    if (!this.config.backdrop && this.config.ignoreBackdropClick) {
      this._renderer.setStyle(this._element.nativeElement, 'position', 'fixed');

      if (
        navigator.userAgent.indexOf('Safari') !== -1 &&
        navigator.userAgent.indexOf('Chrome') === -1
      ) {
        this._renderer.setStyle(this._element.nativeElement, 'overflow', 'unset');
        this._renderer.setStyle(this._element.nativeElement, 'overflow-y', 'unset');
        this._renderer.setStyle(this._element.nativeElement, 'overflow-x', 'unset');
      }
    }
  }

  /** Allows to manually close modal */
  public hide(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    // fix(modal): resolved problem with not pausing iframe/video when closing modal
    const iframeElements = Array.from(this._element.nativeElement.querySelectorAll('iframe'));
    const videoElements = Array.from(this._element.nativeElement.querySelectorAll('video'));

    iframeElements.forEach((iframe: HTMLIFrameElement) => {
      const srcAttribute: any = iframe.getAttribute('src');
      this._renderer.setAttribute(iframe, 'src', srcAttribute);
    });

    videoElements.forEach((video: HTMLVideoElement) => {
      video.pause();
    });

    this.onHide.emit(this);
    this.close.emit(this);

    if (!this._isShown) {
      return;
    }

    clearTimeout(this.timerHideModal);
    clearTimeout(this.timerRmBackDrop);

    this._isShown = false;
    this._renderer.removeClass(this._element.nativeElement, ClassName.IN);
    if (!isBs3()) {
      this._renderer.removeClass(this._element.nativeElement, ClassName.SHOW);
    }

    if (this.isAnimated) {
      this.timerHideModal = setTimeout(() => this.hideModal(), TRANSITION_DURATION);
    } else {
      this.hideModal();
    }
  }

  /** Private methods @internal */
  protected getConfig(config?: ModalOptions): ModalOptions {
    return Object.assign({}, modalConfigDefaults, config);
  }

  /**
   *  Show dialog
   *  @internal
   */
  protected showElement(): void {
    if (
      !this._element.nativeElement.parentNode ||
      this._element.nativeElement.parentNode.nodeType !== Node.ELEMENT_NODE
    ) {
      // don't move modals dom position
      if (document && document.body) {
        document.body.appendChild(this._element.nativeElement);
      }
    }

    this._renderer.setAttribute(this._element.nativeElement, 'aria-hidden', 'false');
    this._renderer.setStyle(this._element.nativeElement, 'display', 'block');
    this._renderer.setProperty(this._element.nativeElement, 'scrollTop', 0);

    if (this.isAnimated) {
      Utils.reflow(this._element.nativeElement);
    }

    this._renderer.addClass(this._element.nativeElement, ClassName.IN);
    if (!isBs3()) {
      this._renderer.addClass(this._element.nativeElement, ClassName.SHOW);
    }

    const transitionComplete = () => {
      if (this._config.focus) {
        this._element.nativeElement.focus();
      }
      this.onShown.emit(this);
      this.opened.emit(this);
    };

    if (this.isAnimated) {
      setTimeout(transitionComplete, TRANSITION_DURATION);
    } else {
      transitionComplete();
    }
  }

  /** @internal */
  protected hideModal(): void {
    this._renderer.setAttribute(this._element.nativeElement, 'aria-hidden', 'true');
    this._renderer.setStyle(this._element.nativeElement, 'display', 'none');
    this.showBackdrop(() => {
      if (!this.isNested) {
        if (document && document.body) {
          this._renderer.removeClass(document.body, ClassName.OPEN);
        }
      }
      this.resetAdjustments();
      this.focusOtherModal();
      this.onHidden.emit(this);
      this.closed.emit(this);
    });
  }

  /** @internal */
  protected showBackdrop(callback?: Function): void {
    if (
      this._isShown &&
      this.config.backdrop &&
      (!this.backdrop || !this.backdrop.instance.isShown)
    ) {
      this.removeBackdrop();
      this._backdrop
        .attach(ModalBackdropComponent)
        .to('body')
        .show({ isAnimated: this.isAnimated });
      this.backdrop = this._backdrop._componentRef;

      if (!callback) {
        return;
      }

      if (!this.isAnimated) {
        callback();
        return;
      }

      setTimeout(callback, BACKDROP_TRANSITION_DURATION);
    } else if (!this._isShown && this.backdrop) {
      this.backdrop.instance.isShown = false;

      const callbackRemove = () => {
        this.removeBackdrop();
        if (callback) {
          callback();
        }
      };

      if (this.backdrop.instance.isAnimated) {
        this.timerRmBackDrop = setTimeout(callbackRemove, BACKDROP_TRANSITION_DURATION);
      } else {
        callbackRemove();
      }
    } else if (callback) {
      callback();
    }
  }

  /** @internal */
  protected removeBackdrop(): void {
    this._backdrop.hide();
    this.backdrop = undefined;
  }

  protected focusOtherModal() {
    try {
      const otherOpenedModals = this._element.nativeElement.parentElement.querySelectorAll(
        '.in[mdbModal]'
      );
      if (!otherOpenedModals.length) {
        return;
      }
      otherOpenedModals[otherOpenedModals.length - 1].nativeElement.focus();
    } catch (error) {}
  }

  /** @internal */
  protected resetAdjustments(): void {
    this._renderer.setStyle(this._element.nativeElement, 'paddingLeft', '');
    this._renderer.setStyle(this._element.nativeElement, 'paddingRight', '');
  }

  /** Scroll bar tricks */
  /** @internal */
  protected checkScrollbar(): void {
    this.isBodyOverflowing = document.body.clientWidth < window.innerWidth;
    this.scrollbarWidth = this.getScrollbarWidth();
  }

  protected setScrollbar(): void {
    if (!document) {
      return;
    }
    this.originalBodyPadding = parseInt(
      window.getComputedStyle(document.body).getPropertyValue('padding-right') || 0,
      10
    );
  }

  // thx d.walsh
  protected getScrollbarWidth(): number {
    const scrollDiv = this._renderer.createElement('div', void 0);
    this._renderer.appendChild(document.body, scrollDiv);
    scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }
}
