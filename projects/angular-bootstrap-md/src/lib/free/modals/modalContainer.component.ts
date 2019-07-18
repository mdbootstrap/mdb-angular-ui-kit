import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  HostBinding,
  ViewEncapsulation,
} from '@angular/core';
import { ClassName, DISMISS_REASONS, ModalOptions, TransitionDurations } from './modal.options';
import { isBs3 } from '../utils/ng2-bootstrap-config';
import { Utils } from '../utils';
import { MDBModalService } from './modal.service';

@Component({
  selector: 'mdb-modal-container',
  templateUrl: 'modalContainer.component.html',
  styleUrls: ['./modals-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalContainerComponent implements OnInit, OnDestroy {
  modalClass = 'modal';
  @HostBinding('tabindex') tabindex = -1;
  @HostBinding('role') role = 'dialog';
  @HostBinding('class.modal') modal = true;

  private mdbModalService: MDBModalService;

  public config: ModalOptions;
  public isShown = false;
  public level: number;
  public isAnimated: boolean;
  protected _element: ElementRef;
  private isModalHiding = false;

  private utils: Utils = new Utils();

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    if (
      this.config.ignoreBackdropClick ||
      this.config.backdrop === 'static' ||
      event.target !== this._element.nativeElement
    ) {
      return;
    }
    this.mdbModalService.setDismissReason(DISMISS_REASONS.BACKRDOP);
    this.hide();
  }

  @HostListener('window:keydown.esc')
  public onEsc(): void {
    if (this.config.keyboard && this.level === this.mdbModalService.getModalsCount()) {
      this.mdbModalService.setDismissReason(DISMISS_REASONS.ESC);
      this.hide();
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: any) {
    this.utils.focusTrapModal(event, this._element);
  }

  public constructor(options: ModalOptions, _element: ElementRef, private _renderer: Renderer2) {
    // this.mdbModalService = msConfig.serviceInstance;

    this._element = _element;
    this.config = Object.assign({}, options);
  }

  ngOnInit(): void {
    if (this.config.animated) {
      this._renderer.addClass(this._element.nativeElement, 'fade');
    }
    this._renderer.setStyle(this._element.nativeElement, 'display', 'block');
    if (
      (window &&
        window.navigator.userAgent.indexOf('Edge') !== -1 &&
        this.config &&
        this.config.toString().indexOf('side-modal') === -1) ||
      (window &&
        window.navigator.userAgent.indexOf('Edge') !== -1 &&
        this.config &&
        this.config.toString().indexOf('modal-full-height') === -1)
    ) {
      this.isShown = true;
      this._renderer.addClass(this._element.nativeElement, isBs3() ? ClassName.IN : ClassName.SHOW);
      this._renderer.setStyle(this._element.nativeElement, 'transition', 'transform 0.3s ease-out');
      this._renderer.setStyle(this._element.nativeElement, 'transform', 'translate(0, 25px)');
    } else {
      setTimeout(
        () => {
          this.isShown = true;
          this._renderer.addClass(
            this._element.nativeElement,
            isBs3() ? ClassName.IN : ClassName.SHOW
          );
        },
        this.isAnimated ? TransitionDurations.BACKDROP : 0
      );
    }

    if (document && document.body) {
      if (this.mdbModalService.getModalsCount() === 1) {
        this.mdbModalService.checkScrollbar();
        this.mdbModalService.setScrollbar();
      }
      this._renderer.addClass(document.body, ClassName.OPEN);
    }

    if (this.config.containerClass) {
      this.updateContainerClass();
    }

    if (this.config.scroll) {
      this._renderer.setStyle(this._element.nativeElement, 'overflow-y', 'auto');
    }
  }

  focusModalElement() {
    if (this.config.focus) {
      this._element.nativeElement.focus();
    }
  }

  updateContainerClass() {
    if (this.config.containerClass) {
      const containerClasses = this.config.containerClass;
      const classArr = containerClasses.split(' ');

      for (let i = 0; i < classArr.length; i++) {
        this._renderer.addClass(this._element.nativeElement, classArr[i]);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.isShown) {
      this.hide();
    }
  }

  hide(): void {
    if (this.isModalHiding || !this.isShown) {
      return;
    }
    this.isModalHiding = true;
    this._renderer.removeClass(
      this._element.nativeElement,
      isBs3() ? ClassName.IN : ClassName.SHOW
    );

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

    setTimeout(
      () => {
        this.isShown = false;
        if (document && document.body && this.mdbModalService.getModalsCount() === 1) {
          this._renderer.removeClass(document.body, ClassName.OPEN);
        }
        this.mdbModalService.hide(this.level);
        this.isModalHiding = false;
      },
      this.isAnimated ? TransitionDurations.MODAL : 0
    );
  }
}
